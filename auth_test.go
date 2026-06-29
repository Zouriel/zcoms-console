package main

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// testServer builds a Server with a fixed in-memory secret (no clients needed —
// the session/cookie machinery never touches comms/agent, and we avoid touching
// the on-disk secret file).
func testServer(secret string) *Server { return &Server{secret: []byte(secret)} }

func reqWithCookie(tok string) *http.Request {
	req := httptest.NewRequest(http.MethodGet, "/api/contacts", nil)
	req.AddCookie(&http.Cookie{Name: cookieName, Value: tok})
	return req
}

func TestStatelessSession(t *testing.T) {
	s := testServer("secret-A-aaaaaaaaaaaaaaaaaaaaaaaa")
	tok := s.newSession()

	if !s.validSession(reqWithCookie(tok)) {
		t.Fatal("fresh session rejected")
	}
	if s.validSession(reqWithCookie(tok + "ff")) {
		t.Fatal("tampered token accepted")
	}
	if s.validSession(reqWithCookie("garbage")) {
		t.Fatal("malformed token accepted")
	}

	// A different secret must reject the token (signature enforced).
	if testServer("secret-B-bbbbbbbbbbbbbbbbbbbbbbbb").validSession(reqWithCookie(tok)) {
		t.Fatal("token accepted across secrets")
	}

	// Survives a "restart": a fresh Server with the SAME (persisted) secret still
	// accepts the existing cookie — the whole point of the change.
	if !testServer("secret-A-aaaaaaaaaaaaaaaaaaaaaaaa").validSession(reqWithCookie(tok)) {
		t.Fatal("token rejected after restart with the same secret")
	}

	// An expired token is rejected.
	expired := s.signToken("v1:" + strconv.FormatInt(time.Now().Add(-time.Hour).Unix(), 10))
	if s.validSession(reqWithCookie(expired)) {
		t.Fatal("expired token accepted")
	}
}

func TestBcryptRoundtrip(t *testing.T) {
	hash, err := bcrypt.GenerateFromPassword([]byte("hunter2"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatal(err)
	}
	if bcrypt.CompareHashAndPassword(hash, []byte("hunter2")) != nil {
		t.Fatal("correct password rejected")
	}
	if bcrypt.CompareHashAndPassword(hash, []byte("wrong")) == nil {
		t.Fatal("wrong password accepted")
	}
}

func TestRequireAuthRejectsAnonymous(t *testing.T) {
	s := testServer("secret-A-aaaaaaaaaaaaaaaaaaaaaaaa")
	called := false
	h := s.requireAuth(func(w http.ResponseWriter, r *http.Request) { called = true })

	rec := httptest.NewRecorder()
	h(rec, httptest.NewRequest(http.MethodGet, "/api/contacts", nil))
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("want 401 for anonymous, got %d", rec.Code)
	}
	if called {
		t.Fatal("protected handler ran for anonymous request")
	}
}

func TestRequireAuthAcceptsValidSession(t *testing.T) {
	s := testServer("secret-A-aaaaaaaaaaaaaaaaaaaaaaaa")
	called := false
	h := s.requireAuth(func(w http.ResponseWriter, r *http.Request) { called = true })

	rec := httptest.NewRecorder()
	h(rec, reqWithCookie(s.newSession()))
	if !called {
		t.Fatalf("valid session rejected: code=%d", rec.Code)
	}
}
