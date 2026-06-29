package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/Zouriel/zcoms/client"
)

// Commerce admin surface. The console owns no commerce state: every call is
// proxied to the zcoms-commerce module over commerce.sock (the same socket
// `zc commerce …` drives), which in turn forwards to the VPS runtime over REST.
// Reads come back as the runtime's JSON; writes/transitions as human text.
//
// commerce is a core-only module and may not be installed — every handler
// degrades to a clear "module not running" error rather than a blank failure.

const commerceActor = "@owner"

// commerce runs one module verb and returns its reply, distinguishing
// "not installed" from a real error so the UI can prompt to install.
func (s *Server) commerce(verb string) (string, error) {
	res, err := client.ModuleCommand("commerce.sock", verb, commerceActor)
	if !res.Running {
		return "", fmt.Errorf("commerce module isn't running — install it with `zc install commerce`")
	}
	if err != nil {
		return "", err
	}
	return res.Reply, nil
}

// commerceRead runs a read verb and returns {json,text}: json is the parsed
// runtime payload when the reply is JSON (the list/show endpoints), text is the
// raw reply for the human-text replies (status, reports).
func (s *Server) commerceRead(w http.ResponseWriter, verb string) {
	reply, err := s.commerce(verb)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	out := map[string]any{"text": reply}
	var parsed any
	if json.Unmarshal([]byte(reply), &parsed) == nil {
		out["json"] = parsed
	}
	writeJSON(w, http.StatusOK, out)
}

// commerceWrite runs a write/transition verb and returns its human reply.
func (s *Server) commerceWrite(w http.ResponseWriter, verb string) {
	reply, err := s.commerce(verb)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"reply": reply})
}

// storeIDFromQuery extracts a required ?store_id= and validates it's non-empty
// and free of whitespace (it goes into a space-split command line).
func storeIDFromQuery(w http.ResponseWriter, r *http.Request) (string, bool) {
	id := strings.TrimSpace(r.URL.Query().Get("store_id"))
	if id == "" || strings.ContainsAny(id, " \t\n") {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("store_id is required"))
		return "", false
	}
	return id, true
}

// safeArg rejects an id/segment that would break the space-split command line.
func safeArg(w http.ResponseWriter, name, v string) (string, bool) {
	v = strings.TrimSpace(v)
	if v == "" || strings.ContainsAny(v, " \t\n") {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("invalid %s", name))
		return "", false
	}
	return v, true
}

// --- Status ---

func (s *Server) handleCommerceStatus(w http.ResponseWriter, r *http.Request) {
	s.commerceRead(w, "status")
}

// --- Stores ---

func (s *Server) handleCommerceStores(w http.ResponseWriter, r *http.Request) {
	s.commerceRead(w, "store list")
}

func (s *Server) handleCommerceStoreShow(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	s.commerceRead(w, "store show "+id)
}

// handleCommerceStoreCreate mirrors the module's store wizard but as a single
// form post: it resolves the merchant @handle to a Telegram user id via the
// comms core (the only piece the non-interactive `store create` path lacks),
// then submits the full tenant+store payload.
func (s *Server) handleCommerceStoreCreate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name              string `json:"name"`
		Slug              string `json:"slug"`
		MerchantHandle    string `json:"merchant_handle"`
		StoreType         string `json:"store_type"`
		MonthlyPriceStars int64  `json:"monthly_price_stars"`
		BotToken          string `json:"bot_token"`
	}
	if !decode(w, r, &body) {
		return
	}
	name := strings.TrimSpace(body.Name)
	if name == "" {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("store name is required"))
		return
	}
	slug := strings.TrimSpace(body.Slug)
	if slug == "" {
		slug = commerceSlug(name)
	}
	if slug == "" {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("could not derive a slug from the name"))
		return
	}
	handle := strings.TrimSpace(body.MerchantHandle)
	if handle != "" && !strings.HasPrefix(handle, "@") {
		handle = "@" + handle
	}
	if handle == "" {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("merchant Telegram @handle is required"))
		return
	}
	uid, err := s.comms.Resolve(handle)
	if err != nil {
		writeErr(w, http.StatusBadGateway, fmt.Errorf("resolve merchant %s: %w", handle, err))
		return
	}
	if uid == 0 {
		writeErr(w, http.StatusBadGateway, fmt.Errorf("merchant %s not found on Telegram", handle))
		return
	}
	switch body.StoreType {
	case "files", "services", "subscriptions", "mixed":
	default:
		writeErr(w, http.StatusBadRequest, fmt.Errorf("store_type must be files|services|subscriptions|mixed"))
		return
	}
	if strings.TrimSpace(body.BotToken) == "" || !strings.Contains(body.BotToken, ":") {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("a BotFather bot token is required"))
		return
	}
	payload := map[string]any{
		"tenant_name":         name,
		"name":                name,
		"slug":                slug,
		"merchant_username":   strings.TrimPrefix(handle, "@"),
		"merchant_tg_user_id": uid,
		"store_type":          body.StoreType,
		"monthly_price_stars": body.MonthlyPriceStars,
		"bot_token":           strings.TrimSpace(body.BotToken),
	}
	b, _ := json.Marshal(payload)
	s.commerceWrite(w, "store create "+string(b))
}

func (s *Server) handleCommerceStoreTransition(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	action := r.PathValue("action")
	switch action {
	case "activate", "suspend", "archive":
	default:
		writeErr(w, http.StatusBadRequest, fmt.Errorf("action must be activate|suspend|archive"))
		return
	}
	s.commerceWrite(w, "store "+action+" "+id)
}

// --- Products ---

func (s *Server) handleCommerceProducts(w http.ResponseWriter, r *http.Request) {
	id, ok := storeIDFromQuery(w, r)
	if !ok {
		return
	}
	s.commerceRead(w, "product list "+id)
}

func (s *Server) handleCommerceProductCreate(w http.ResponseWriter, r *http.Request) {
	raw, ok := commerceRawJSON(w, r)
	if !ok {
		return
	}
	s.commerceWrite(w, "product create "+raw)
}

func (s *Server) handleCommerceProductUpdate(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	raw, ok := commerceRawJSON(w, r)
	if !ok {
		return
	}
	s.commerceWrite(w, "product update "+id+" "+raw)
}

func (s *Server) handleCommerceProductDelete(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	s.commerceWrite(w, "product delete "+id)
}

// --- Orders ---

func (s *Server) handleCommerceOrders(w http.ResponseWriter, r *http.Request) {
	id, ok := storeIDFromQuery(w, r)
	if !ok {
		return
	}
	s.commerceRead(w, "order list "+id)
}

func (s *Server) handleCommerceOrderShow(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	s.commerceRead(w, "order show "+id)
}

// --- Refunds ---

func (s *Server) handleCommerceRefunds(w http.ResponseWriter, r *http.Request) {
	verb := "refund list"
	if id := strings.TrimSpace(r.URL.Query().Get("store_id")); id != "" && !strings.ContainsAny(id, " \t\n") {
		verb += " " + id
	}
	s.commerceRead(w, verb)
}

func (s *Server) handleCommerceRefundApprove(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	s.commerceWrite(w, "refund approve "+id)
}

func (s *Server) handleCommerceRefundDeny(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	var body struct {
		Reason string `json:"reason"`
	}
	_ = decode(w, r, &body) // reason is optional
	verb := "refund deny " + id
	if reason := strings.TrimSpace(body.Reason); reason != "" {
		verb += " " + reason // joined back into one line by the module
	}
	s.commerceWrite(w, verb)
}

// --- Billing ---

func (s *Server) handleCommerceBilling(w http.ResponseWriter, r *http.Request) {
	id, ok := storeIDFromQuery(w, r)
	if !ok {
		return
	}
	s.commerceRead(w, "billing history "+id)
}

func (s *Server) handleCommerceBillingInvoice(w http.ResponseWriter, r *http.Request) {
	var body struct {
		StoreID string `json:"store_id"`
	}
	if !decode(w, r, &body) {
		return
	}
	id, ok := safeArg(w, "store_id", body.StoreID)
	if !ok {
		return
	}
	s.commerceWrite(w, "billing invoice "+id)
}

// --- Reports ---

func (s *Server) handleCommerceReportPlatform(w http.ResponseWriter, r *http.Request) {
	s.commerceRead(w, "report platform")
}

func (s *Server) handleCommerceReportStore(w http.ResponseWriter, r *http.Request) {
	id, ok := storeIDFromQuery(w, r)
	if !ok {
		return
	}
	s.commerceRead(w, "report store "+id)
}

// commerceRawJSON reads a JSON object body and re-marshals it compactly so it
// survives the module's space-split command parser (no newlines, single spaces).
func commerceRawJSON(w http.ResponseWriter, r *http.Request) (string, bool) {
	var obj map[string]any
	if !decode(w, r, &obj) {
		return "", false
	}
	if len(obj) == 0 {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("a JSON body is required"))
		return "", false
	}
	b, err := json.Marshal(obj)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return "", false
	}
	return string(b), true
}

// commerceSlug derives a url-safe slug from a store name (mirrors the module's
// normalizeSlug so the console preview matches what the module would generate).
func commerceSlug(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	var b strings.Builder
	lastHyphen := false
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
			lastHyphen = false
			continue
		}
		if (r == '-' || r == '_' || r == ' ') && !lastHyphen && b.Len() > 0 {
			b.WriteByte('-')
			lastHyphen = true
		}
	}
	return strings.Trim(b.String(), "-")
}
