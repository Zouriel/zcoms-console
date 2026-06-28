package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"golang.org/x/crypto/bcrypt"
)

// newTestServer builds a Server with a fixed secret (no clients needed for the
// session/cookie machinery, which never touches comms/agent).
func newTestServer(t *testing.T) *Server {
	t.Helper()
	return newServer(nil, nil)
}

func TestTokenSignRoundtrip(t *testing.T) {
	s := newTestServer(t)
	tok := s.signToken("abc123")
	id, ok := s.verifyToken(tok)
	if !ok || id != "abc123" {
		t.Fatalf("roundtrip failed: id=%q ok=%v", id, ok)
	}

	// Tampering must fail verification.
	if _, ok := s.verifyToken(tok + "ff"); ok {
		t.Fatal("tampered token accepted")
	}
	if _, ok := s.verifyToken("garbage"); ok {
		t.Fatal("malformed token accepted")
	}

	// A second server with a different secret must reject the token.
	other := newTestServer(t)
	if _, ok := other.verifyToken(tok); ok {
		t.Fatal("token accepted across servers (secret not enforced)")
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
	s := newTestServer(t)
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
	s := newTestServer(t)
	cookie := s.newSession()

	called := false
	h := s.requireAuth(func(w http.ResponseWriter, r *http.Request) { called = true })

	req := httptest.NewRequest(http.MethodGet, "/api/contacts", nil)
	req.AddCookie(&http.Cookie{Name: cookieName, Value: cookie})
	rec := httptest.NewRecorder()
	h(rec, req)
	if !called {
		t.Fatalf("valid session rejected: code=%d", rec.Code)
	}
}
