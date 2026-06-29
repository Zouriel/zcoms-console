package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const (
	cookieName     = "zc_console"
	sessionTTL     = 30 * 24 * time.Hour // a month — this is a local single-operator tool
	passwordSetKey = "console.password_hash"
)

// signToken returns "payload.sig" where sig = HMAC-SHA256(secret, payload). The
// secret is stable across restarts (loadOrCreateSecret), so a signed token stays
// valid until it self-expires — no server-side session table needed.
func (s *Server) signToken(payload string) string {
	mac := hmac.New(sha256.New, s.secret)
	mac.Write([]byte(payload))
	return payload + "." + hex.EncodeToString(mac.Sum(nil))
}

// newSession mints a stateless, self-expiring session token. The payload carries
// only the expiry, so validation needs nothing but the secret.
func (s *Server) newSession() string {
	payload := "v1:" + strconv.FormatInt(time.Now().Add(sessionTTL).Unix(), 10)
	return s.signToken(payload)
}

// validSession reports whether the request carries a live, correctly-signed
// token. Stateless: it survives a console restart because the secret does.
func (s *Server) validSession(r *http.Request) bool {
	c, err := r.Cookie(cookieName)
	if err != nil {
		return false
	}
	payload, sig, ok := strings.Cut(c.Value, ".")
	if !ok {
		return false
	}
	mac := hmac.New(sha256.New, s.secret)
	mac.Write([]byte(payload))
	got, err := hex.DecodeString(sig)
	if err != nil || subtle.ConstantTimeCompare(mac.Sum(nil), got) != 1 {
		return false
	}
	_, expStr, ok := strings.Cut(payload, ":")
	if !ok {
		return false
	}
	exp, err := strconv.ParseInt(expStr, 10, 64)
	return err == nil && time.Now().Unix() <= exp
}

// requireAuth wraps an authenticated handler, rejecting sessionless requests.
func (s *Server) requireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !s.validSession(r) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "not authenticated"})
			return
		}
		next(w, r)
	}
}

func (s *Server) handleAuthStatus(w http.ResponseWriter, r *http.Request) {
	hash, _ := s.setting(passwordSetKey)
	writeJSON(w, http.StatusOK, map[string]any{
		"authenticated":   s.validSession(r),
		"needs_setup":     strings.TrimSpace(hash) == "", // first run: no password yet
		"agent_available": s.agent.Available(),
	})
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	if body.Password == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "password required"})
		return
	}

	hash, _ := s.setting(passwordSetKey)
	hash = strings.TrimSpace(hash)

	if hash == "" {
		// First-run: this login *sets* the owner password.
		if err := s.setPassword(body.Password); err != nil {
			writeErr(w, http.StatusInternalServerError, err)
			return
		}
	} else if bcrypt.CompareHashAndPassword([]byte(hash), []byte(body.Password)) != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "wrong password"})
		return
	}

	s.setCookie(w, s.newSession())
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	// Stateless tokens aren't revoked server-side (single-operator local tool);
	// clearing the cookie ends the session for this browser.
	http.SetCookie(w, &http.Cookie{
		Name: cookieName, Value: "", Path: "/", MaxAge: -1,
		HttpOnly: true, SameSite: http.SameSiteLaxMode,
	})
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) setCookie(w http.ResponseWriter, value string) {
	http.SetCookie(w, &http.Cookie{
		Name:     cookieName,
		Value:    value,
		Path:     "/",
		HttpOnly: true,                 // not script-readable
		SameSite: http.SameSiteLaxMode, // localhost-only tool; Lax is enough
		MaxAge:   int(sessionTTL.Seconds()),
		// Secure intentionally unset: we serve plain HTTP on 127.0.0.1. If this
		// ever moves off loopback, add Secure + TLS (see package SECURITY note).
	})
}

// setPassword bcrypts the password and persists it through the agent (which
// owns agent.db settings). The console never writes the db directly.
func (s *Server) setPassword(plain string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = s.agent.Command("settings set "+passwordSetKey+" "+string(hash), "")
	return err
}
