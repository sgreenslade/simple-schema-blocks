=== Simple Schema Blocks ===
Contributors:      webtastic
Tags:              schema, faq, structured data, json-ld, gutenberg
Requires at least: 6.6
Tested up to:      6.8
Requires PHP:      8.2
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Add FAQ schema blocks to your WordPress pages. Clean JSON-LD structured data output. Gutenberg native. Works with any SEO plugin.

== Description ==

Simple Schema Blocks adds Gutenberg blocks that do two things at once: they render readable content on the page and write valid JSON-LD structured data into the page `<head>` — no manual coding required.

**v1 includes:**

* **FAQ block** — renders an accessible accordion and outputs a valid `FAQPage` JSON-LD object.

The plugin works alongside any existing SEO plugin (Yoast SEO, Rank Math, Slim SEO, The SEO Framework). It outputs raw JSON-LD and does not interact with or depend on any SEO plugin.

**Why not just use Yoast or Rank Math?**

Both are capable, but they're large and opinionated. Installing a full SEO plugin just for FAQ schema is overkill, and switching SEO plugins is painful if you already have one. Simple Schema Blocks does one thing well and stays out of the way of everything else on the site.

== How It Works ==

1. Install and activate the plugin.
2. Open any page or post in the block editor.
3. Add the **FAQ** block from the "Simple Schema Blocks" category.
4. Type your questions and answers.
5. Publish. The plugin automatically outputs valid `FAQPage` JSON-LD in the page `<head>`.

No settings page. No API keys. No configuration required.

== Frequently Asked Questions ==

= Will this guarantee rich results in Google Search? =

No. Rich results are not guaranteed — Google decides whether to show them based on relevance, site authority, and content quality. Since 2023, Google has significantly reduced FAQ rich results for most sites. The structured data is still worth adding for how search engines understand your page content, but SERP expansion is a bonus, not a certainty.

= Does this conflict with Yoast SEO or Rank Math? =

No. Simple Schema Blocks outputs raw `<script type="application/ld+json">` into the page `<head>` and does not interact with any SEO plugin.

= What WordPress version is required? =

WordPress 6.6 or higher. The plugin uses the WordPress Interactivity API for the accordion and requires WordPress 6.6+ for the block editor.

= Does this work with classic themes? =

Yes. The block renders clean semantic HTML that inherits styles from your active theme.

= Does it work if I have multiple FAQ blocks on the same page? =

Yes. All questions from multiple FAQ blocks on the same page are merged into a single `FAQPage` entity, which aligns with Google's preference.

= Does the plugin add any CSS or JavaScript to every page? =

No. Styles and scripts are enqueued only on pages that contain the FAQ block.

== Screenshots ==

1. The FAQ block in the Gutenberg editor.
2. The FAQ accordion on the front end.
3. The FAQPage JSON-LD output in the page source.

== Changelog ==

= 0.1.0 =
* Initial release.
* FAQ block with FAQPage JSON-LD output.
* Accessible accordion using the WordPress Interactivity API.
* Works alongside any SEO plugin.

== Upgrade Notice ==

= 0.1.0 =
Initial release.
