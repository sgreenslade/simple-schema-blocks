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
		$question = trim( wp_strip_all_tags( $item['question'] ?? '' ) );
		$answer   = trim( wp_strip_all_tags( $item['answer'] ?? '' ) );

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

	$blocks    = parse_blocks( $content );
	$all_items = [];

	foreach ( $blocks as $block ) {
		if ( 'simple-schema-blocks/faq' !== $block['blockName'] ) {
			continue;
		}

		$all_items = array_merge( $all_items, ssb_extract_faq_items( $block ) );
	}

	if ( empty( $all_items ) ) {
		return;
	}

	$schema = ssb_build_faq_schema( $all_items );
	$json   = wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );

	echo '<script type="application/ld+json">' . $json . '</script>' . "\n";
}
add_action( 'wp_head', 'ssb_output_faq_schema' );
