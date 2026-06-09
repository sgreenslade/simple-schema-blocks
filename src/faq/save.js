import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Block save component — outputs the front-end FAQ accordion HTML.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 *
 * @return {Element} Saved block HTML.
 */
export default function Save( { attributes } ) {
	const blockProps = useBlockProps.save();
	const { items, firstItemOpen, allowMultipleOpen, blockId } = attributes;

	const context = {
		openItems: items.map( ( _, i ) => i === 0 && firstItemOpen ),
		allowMultiple: allowMultipleOpen,
	};

	return (
		<div
			{ ...blockProps }
			data-wp-interactive="simple-schema-blocks/faq"
			data-wp-context={ JSON.stringify( context ) }
		>
			<dl className="ssb-faq">
				{ items.map( ( item, index ) => {
					const isOpen = index === 0 && firstItemOpen;
					const answerId = `ssb-faq-answer-${ blockId }-${
						index + 1
					}`;

					return (
						<div
							key={ index }
							className={ `ssb-faq__item${
								isOpen ? ' ssb-faq__item--open' : ''
							}` }
							data-wp-context={ JSON.stringify( { index } ) }
						>
							<dt className="ssb-faq__question">
								<button
									aria-expanded={ isOpen }
									aria-controls={ answerId }
									data-wp-on--click="actions.toggle"
									data-wp-bind--aria-expanded="state.isCurrentItemOpen"
								>
									{ item.question }
								</button>
							</dt>
							<dd
								className="ssb-faq__answer"
								id={ answerId }
								hidden={ ! isOpen }
								data-wp-bind--hidden="!state.isCurrentItemOpen"
							>
								<RichText.Content value={ item.answer } />
							</dd>
						</div>
					);
				} ) }
			</dl>
		</div>
	);
}
