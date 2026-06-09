import {
	InspectorControls,
	PlainText,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl } from '@wordpress/components';
import { chevronDown, chevronUp, close, code } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';

/**
 * Updates a single item in the items array immutably.
 *
 * @param {Array}  items Items array from block attributes.
 * @param {number} index Index of the item to update.
 * @param {Object} patch Key/value pairs to merge into the item.
 *
 * @return {Array} New items array with the update applied.
 */
function updateItem( items, index, patch ) {
	return items.map( ( item, i ) =>
		i === index ? { ...item, ...patch } : item
	);
}

/**
 * Renders a CSS snippet with a description and one-click copy button.
 *
 * @param {Object} props       Component props.
 * @param {string} props.label Description shown above the code block.
 * @param {string} props.css   The CSS snippet to display and copy.
 *
 * @return {Element} CSS example block.
 */
function CssExample( { label, css } ) {
	const [ copied, setCopied ] = useState( false );

	/**
	 * Copies the CSS snippet to the clipboard and shows brief feedback.
	 *
	 * @return {void}
	 */
	function handleCopy() {
		window.navigator.clipboard.writeText( css );
		setCopied( true );
		setTimeout( () => setCopied( false ), 2000 );
	}

	return (
		<div className="ssb-faq-editor__css-example">
			<p className="ssb-faq-editor__css-example-label">{ label }</p>
			<div className="ssb-faq-editor__css-example-block">
				<pre className="ssb-faq-editor__css-example-code">
					<code>{ css }</code>
				</pre>
				<Button
					variant="tertiary"
					onClick={ handleCopy }
					className="ssb-faq-editor__css-copy"
				>
					{ copied
						? __( 'Copied!', 'simple-schema-blocks' )
						: __( 'Copy', 'simple-schema-blocks' ) }
				</Button>
			</div>
		</div>
	);
}

/**
 * Block edit component — renders Q&A item fields with rich text editing.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 *
 * @return {Element} Block editor UI.
 */
export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { items, firstItemOpen, allowMultipleOpen, blockId } = attributes;

	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( {
				blockId: Math.random().toString( 36 ).slice( 2, 8 ),
			} );
		}
		// Run once on insertion only — blockId is intentionally excluded.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	/**
	 * Moves an item one position in the given direction.
	 *
	 * @param {number} index     Index of the item to move.
	 * @param {number} direction -1 to move up, 1 to move down.
	 *
	 * @return {void}
	 */
	function moveItem( index, direction ) {
		const next = [ ...items ];
		const target = index + direction;
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		setAttributes( { items: next } );
	}

	/**
	 * Appends a new empty Q&A pair to the items list.
	 *
	 * @return {void}
	 */
	function addItem() {
		setAttributes( {
			items: [ ...items, { question: '', answer: '' } ],
		} );
	}

	/**
	 * Removes the item at the given index from the items list.
	 *
	 * @param {number} index Index of the item to remove.
	 *
	 * @return {void}
	 */
	function removeItem( index ) {
		setAttributes( {
			items: items.filter( ( _, i ) => i !== index ),
		} );
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FAQ settings', 'simple-schema-blocks' ) }
				>
					<ToggleControl
						label={ __(
							'First item open by default',
							'simple-schema-blocks'
						) }
						checked={ firstItemOpen }
						onChange={ ( value ) =>
							setAttributes( { firstItemOpen: value } )
						}
					/>
					<ToggleControl
						label={ __(
							'Allow multiple open',
							'simple-schema-blocks'
						) }
						checked={ allowMultipleOpen }
						onChange={ ( value ) =>
							setAttributes( { allowMultipleOpen: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'CSS classes', 'simple-schema-blocks' ) }
					icon={ code }
					initialOpen={ false }
				>
					<p className="ssb-faq-editor__css-intro">
						{ __(
							'Use these selectors in your theme\'s stylesheet or Appearance → Customize → Additional CSS.',
							'simple-schema-blocks'
						) }
					</p>
					<p className="ssb-faq-editor__css-intro">
						{ __(
							'The "Additional CSS classes" field above is different — it adds a class name to this block\'s wrapper so you can target a specific FAQ block instance. Write the CSS rule first, then put just the class name (e.g. faq-highlight) in that field.',
							'simple-schema-blocks'
						) }
					</p>
					<ul className="ssb-faq-editor__css-list">
						<li>
							<code>.wp-block-simple-schema-blocks-faq</code>
						</li>
						<li>
							<code>.ssb-faq</code>
						</li>
						<li>
							<code>.ssb-faq__item</code>
						</li>
						<li>
							<code>.ssb-faq__question</code>
						</li>
						<li>
							<code>.ssb-faq__answer</code>
						</li>
					</ul>
					<CssExample
						label={ __(
							'Make the question bold:',
							'simple-schema-blocks'
						) }
						css={ `.ssb-faq__question button {\n\tfont-weight: bold !important;\n}` }
					/>
					<CssExample
						label={ __(
							'Italic, indented answer:',
							'simple-schema-blocks'
						) }
						css={ `.ssb-faq__answer {\n\tfont-style: italic !important;\n\tpadding-left: 1em !important;\n}` }
					/>
					<CssExample
						label={ __(
							'Highlight the open question:',
							'simple-schema-blocks'
						) }
						css={ `.ssb-faq__item--open .ssb-faq__question button {\n\tcolor: #0073aa !important;\n\tfont-weight: bold !important;\n}` }
					/>
					<CssExample
						label={ __(
							'Increase spacing between items:',
							'simple-schema-blocks'
						) }
						css={ `.ssb-faq__item {\n\tmargin-bottom: 1.5em !important;\n}` }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ items.map( ( item, index ) => (
					<Fragment key={ index }>
						<div className="ssb-faq-editor__item">
							<div className="ssb-faq-editor__item-header">
								<span className="ssb-faq-editor__item-number">
									{ __( 'FAQ', 'simple-schema-blocks' ) }
								</span>
								<Button
									icon={ chevronUp }
									disabled={ index === 0 }
									label={ __(
										'Move up',
										'simple-schema-blocks'
									) }
									onClick={ () => moveItem( index, -1 ) }
								/>
								<Button
									icon={ chevronDown }
									disabled={ index === items.length - 1 }
									label={ __(
										'Move down',
										'simple-schema-blocks'
									) }
									onClick={ () => moveItem( index, 1 ) }
								/>
								<Button
									icon={ close }
									isDestructive
									disabled={ items.length === 1 }
									label={ __(
										'Remove question',
										'simple-schema-blocks'
									) }
									onClick={ () => removeItem( index ) }
								/>
							</div>
							<label
								htmlFor={ `ssb-question-${ index }` }
								className="ssb-faq-editor__label"
							>
								{ __( 'Question', 'simple-schema-blocks' ) }
							</label>
							<PlainText
								id={ `ssb-question-${ index }` }
								className="ssb-faq-editor__question"
								placeholder={ __(
									'Enter your question…',
									'simple-schema-blocks'
								) }
								value={ item.question }
								onChange={ ( question ) =>
									setAttributes( {
										items: updateItem( items, index, {
											question,
										} ),
									} )
								}
							/>
							<p className="ssb-faq-editor__label">
								{ __( 'Answer', 'simple-schema-blocks' ) }
							</p>
							<RichText
								tagName="div"
								className="ssb-faq-editor__answer"
								placeholder={ __(
									'Enter your answer…',
									'simple-schema-blocks'
								) }
								allowedFormats={ [
									'core/bold',
									'core/italic',
									'core/link',
								] }
								value={ item.answer }
								onChange={ ( answer ) =>
									setAttributes( {
										items: updateItem( items, index, {
											answer,
										} ),
									} )
								}
							/>
						</div>
						{ index < items.length - 1 && (
							<hr className="ssb-faq-editor__divider" />
						) }
					</Fragment>
				) ) }
				<hr className="ssb-faq-editor__divider" />
				<Button
					variant="secondary"
					onClick={ addItem }
					className="ssb-faq-editor__add-button"
				>
					{ __( 'Add question', 'simple-schema-blocks' ) }
				</Button>
			</div>
		</>
	);
}
