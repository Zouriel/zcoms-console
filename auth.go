package main

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const (
	cookieName     = "zc_console"
	sessionTTL     = 12 * time.Hour
	passwordSetKey = "console.password_hash"
)

// signToken returns "id.sig" where sig = HMAC-SHA256(secret, id). The server
// secret is regenerated every startup, so a restart invalidates all cookies —
// fine for a single-operator local tool.
func (s *Server) signToken(id string) string {
	mac := hmac.New(sha256.New, s.secret)
	mac.Write([]byte(id))
	return id + "." + hex.EncodeToString(mac.Sum(nil))
}

// verifyToken validates the HMAC signature and returns the session id.
func (s *Server) verifyToken(tok string) (string, bool) {
	id, sig, ok := strings.Cut(tok, ".")
	if !ok {
		return "", false
	}
	mac := hmac.New(sha256.New, s.secret)
	mac.Write([]byte(id))
	want := mac.Sum(nil)
	got, err := hex.DecodeString(sig)
	if err != nil || subtle.ConstantTimeCompare(want, got) != 1 {
		return "", false
	}
	return id, true
}

// newSession mints a random session id, records its expiry, and returns the
// signed cookie value.
func (s *Server) newSession() string {
	raw := make([]byte, 32)
	_, _ = rand.Read(raw)
	id := hex.EncodeToString(raw)
	s.mu.Lock()
	s.sessions[id] = time.Now().Add(sessionTTL)
	s.mu.Unlock()
	return s.signToken(id)
}

// validSession reports whether the request carries a live, signed session.
func (s *Server) validSession(r *http.Request) bool {
	c, err := r.Cookie(cookieName)
	if err != nil {
		return false
	}
	id, ok := s.verifyToken(c.Value)
	if !ok {
		return false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	exp, ok := s.sessions[id]
	if !ok || time.Now().After(exp) {
		delete(s.sessions, id)
		return false
	}
	return true
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
	if c, err := r.Cookie(cookieName); err == nil {
		if id, ok := s.verifyToken(c.Value); ok {
			s.mu.Lock()
			delete(s.sessions, id)
			s.mu.Unlock()
		}
	}
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
