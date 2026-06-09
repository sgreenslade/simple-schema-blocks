<?php
/**
 * Plugin Name: Simple Schema Blocks
 * Plugin URI:  https://web-tastic.com/plugins/simple-schema-blocks
 * Description: Gutenberg blocks that render readable content and output valid JSON-LD structured data. Add FAQ schema to any page — no coding required.
 * Version:     0.1.0
 * Author:      Web-Tastic
 * Author URI:  https://web-tastic.com
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: simple-schema-blocks
 * Requires at least: 6.6
 * Requires PHP: 8.2
 *
 * @package SimpleSchemaBlocks
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SSB_VERSION', '0.1.0' );
define( 'SSB_PLUGIN_FILE', __FILE__ );
define( 'SSB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SSB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers the Simple Schema Blocks block category.
 *
 * @param array[] $categories Array of block categories.
 *
 * @return array[] Modified array with the plugin category prepended.
 */
function ssb_register_block_category( array $categories ): array {
	return array_merge(
		[
			[
				'slug'  => 'simple-schema-blocks',
				'title' => __( 'Simple Schema Blocks', 'simple-schema-blocks' ),
				'icon'  => null,
			],
		],
		$categories
	);
}
add_filter( 'block_categories_all', 'ssb_register_block_category' );

/**
 * Registers all plugin blocks.
 *
 * @return void
 */
function ssb_register_blocks(): void {
	register_block_type( SSB_PLUGIN_DIR . 'build/faq' );
}
add_action( 'init', 'ssb_register_blocks' );

require_once SSB_PLUGIN_DIR . 'includes/schema-output.php';
