import { store, getContext } from '@wordpress/interactivity';

store( 'simple-schema-blocks/faq', {
	state: {
		/**
		 * Derives whether the current item is open by reading the item's
		 * index from context and looking it up in the openItems array.
		 * Used by data-wp-bind--hidden and data-wp-bind--aria-expanded.
		 *
		 * @return {boolean} True if this item is open.
		 */
		get isCurrentItemOpen() {
			const context = getContext();
			return !! context.openItems[ context.index ];
		},
	},

	actions: {
		/**
		 * Toggles the clicked FAQ item open or closed.
		 *
		 * When allowMultiple is false, opening one item closes all others.
		 *
		 * @return {void}
		 */
		toggle() {
			const context = getContext();
			const { index, openItems, allowMultiple } = context;
			const clickedIsOpen = openItems[ index ];

			if ( allowMultiple ) {
				context.openItems[ index ] = ! clickedIsOpen;
			} else {
				openItems.forEach( ( _, i ) => {
					context.openItems[ i ] =
						i === index ? ! clickedIsOpen : false;
				} );
			}
		},
	},
} );
