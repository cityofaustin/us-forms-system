import React from 'react';

/*
 * This is the template for each field (which in the schema library means label + widget)
 */

export default function ReviewFieldTemplate(props) {
  const { children, uiSchema, schema } = props;
  const label = uiSchema['ui:title'] || props.label;
  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = typeof description === 'function'
    ? uiSchema['ui:description']
    : null;

  let parentClassName = 'review-row';
  if (uiSchema['ui:options']
    && uiSchema['ui:options'].reviewDirection
    && uiSchema['ui:options'].reviewDirection === 'column'
  ) {
    parentClassName = 'review-column';
  }

  return schema.type === 'object' || schema.type === 'array'
    ? children
    : <div className={parentClassName}>
      <dt>
        {label}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
        {!textDescription && !DescriptionField && description}
      </dt>
      <dd>{children}</dd>
    </div>;
}
