const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

const editorEntry = {
	'faq/editor': path.resolve( __dirname, 'src/faq/editor.scss' ),
};

async function addEditorEntry( config ) {
	const existing =
		typeof config.entry === 'function'
			? await config.entry()
			: config.entry;
	return {
		...config,
		entry: { ...existing, ...editorEntry },
	};
}

module.exports = Array.isArray( defaultConfig )
	? Promise.all( defaultConfig.map( addEditorEntry ) )
	: addEditorEntry( defaultConfig );
