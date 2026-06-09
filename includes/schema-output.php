<?php
/**
 * FAQ schema JSON-LD output.
 *
 * @package SimpleSchemaBlocks
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Extracts all FAQ items from a single parsed block's attributes.
 *
 * Strips HTML tags from answer text — Google's Rich Results Test
 * expects plain text in the acceptedAnswer.text field.
 *
 * @param array $block Parsed block array from parse_blocks().
 *
 * @return array[] Array of {question, answer} arrays with clean text.
 */
function ssb_extract_faq_items( array $block ): array {
	$raw_items = $block['attrs']['items'] ?? [];
	$items     = [];

	foreach ( $raw_items as $item ) {
		$question = trim( wp_specialchars_decode( wp_strip_all_tags( $item['question'] ?? '' ), ENT_QUOTES ) );
		$answer   = trim( wp_specialchars_decode( wp_strip_all_tags( $item['answer'] ?? '' ), ENT_QUOTES ) );

		if ( '' === $question || '' === $answer ) {
			continue;
		}

		$items[] = [
			'question' => $question,
			'answer'   => $answer,
		];
	}

	return $items;
}

/**
 * Builds the FAQPage schema array from a list of Q&A items.
 *
 * @param array[] $items Array of {question, answer} arrays.
 *
 * @return array FAQPage schema structure ready for json_encode().
 */
function ssb_build_faq_schema( array $items ): array {
	$entities = array_map(
		static function ( array $item ): array {
			return [
				'@type'          => 'Question',
				'name'           => $item['question'],
				'acceptedAnswer' => [
					'@type' => 'Answer',
					'text'  => $item['answer'],
				],
			];
		},
		$items
	);

	return [
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $entities,
	];
}

/**
 * Recursively collects all FAQ blocks from a block tree.
 *
 * parse_blocks() returns a nested tree — this walks innerBlocks so FAQ
 * blocks inside Group, Columns, or other containers are not missed.
 *
 * @param array[] $blocks Array of parsed blocks (may contain innerBlocks).
 *
 * @return array[] All FAQ blocks found at any depth.
 */
function ssb_find_faq_blocks( array $blocks ): array {
	$found = [];

	foreach ( $blocks as $block ) {
		if ( 'simple-schema-blocks/faq' === $block['blockName'] ) {
			$found[] = $block;
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$found = array_merge( $found, ssb_find_faq_blocks( $block['innerBlocks'] ) );
		}
	}

	return $found;
}

/**
 * Outputs FAQPage JSON-LD structured data in the page <head>.
 *
 * Runs on wp_head. Returns early on non-singular pages or when
 * no FAQ blocks are present in the current post content.
 *
 * Multiple FAQ blocks on the same page are merged into a single
 * FAQPage entity, which aligns with Google's preference.
 *
 * @return void
 */
function ssb_output_faq_schema(): void {
	if ( ! is_singular() ) {
		return;
	}

	$content = get_the_content();

	if ( ! has_block( 'simple-schema-blocks/faq', $content ) ) {
		return;
	}

	$faq_blocks = ssb_find_faq_blocks( parse_blocks( $content ) );
	$all_items  = [];

	foreach ( $faq_blocks as $block ) {
		$all_items = array_merge( $all_items, ssb_extract_faq_items( $block ) );
	}

	if ( empty( $all_items ) ) {
		return;
	}

	$schema = ssb_build_faq_schema( $all_items );
	$json   = wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );

	echo "\n" . '<script type="application/ld+json">' . $json . '</script>' . "\n";
}
add_action( 'wp_head', 'ssb_output_faq_schema' );
