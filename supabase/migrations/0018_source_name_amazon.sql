-- ─────────────────────────────────────────────────────────────────────────────
-- 0018 — the source wall stops naming a roadmap.
--
-- topSourceNames() derives the homepage's source wall from resources.source_name,
-- and the most-linked name is "Amazon Ads" — which is also the first half of the
-- roadmap title "Amazon Ads & retail media". A wall of publishers with our own
-- product name in it reads as though we are citing ourselves.
--
-- NOT renamed to "Amazon Seller University", which is what was asked for. All 17
-- rows point at Amazon's advertising properties:
--
--     9  advertising.amazon.com/academy
--     5  advertising.amazon.com/solutions/products
--     1  advertising.amazon.com/API/docs
--     1  advertising.amazon.com/resources/ad-specs
--     1  learningconsole.amazonadvertising.com
--
-- Seller University is a different Amazon property (sellercentral.amazon.com/learn)
-- and nothing here links to it. Renaming these to it would credit seventeen pages
-- to a publisher that did not write them, which is the failure mode rule 2 exists
-- to prevent — a wrong attribution on the main surface is worse than an awkward
-- name. "Amazon Ads Academy" is what nine of the seventeen are actually called,
-- it covers the learning console, and it does not collide with the roadmap title.
--
-- If the intent was to cite Seller University, that is new resources pointing at
-- sellercentral.amazon.com/learn, not a rename of these.
--
-- Re-runnable.
-- ─────────────────────────────────────────────────────────────────────────────

update public.resources
set source_name = 'Amazon Ads Academy'
where source_name = 'Amazon Ads';
