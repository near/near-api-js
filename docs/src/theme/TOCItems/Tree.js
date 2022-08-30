import React from 'react';
// Recursive component rendering the toc tree
const getIcon = title => {
  let iconClassName = '';
  switch(title) {
    case 'Properties':
      iconClassName = 'typedoc-icon typedoc-icon-property';
      break;
    case 'Methods':
      iconClassName = 'typedoc-icon typedoc-icon-method';
      break;
    case 'Constructors':
      iconClassName = 'typedoc-icon typedoc-icon-constructor';
      break;
    case 'Variables':
      iconClassName = 'typedoc-icon typedoc-icon-variable';
      break;
    case 'Functions':
      iconClassName = 'typedoc-icon typedoc-icon-function';
      break;
    case 'Type Aliases':
      iconClassName = 'typedoc-icon typedoc-icon-type-alias';
      break;
    case 'Enumeration Members':
      iconClassName = 'typedoc-icon typedoc-icon-enum-member';
      break;
    default:
      iconClassName = '';
      break;
  }
  return <span className={iconClassName}></span>;
}
const getLinkClassName = (linkClassName, parentValue) => {
  if (['Properties', 'Methods', 'Constructors', 'Variables', 'Functions',
    'Type Aliases','Enumeration Members',
  ].includes(parentValue)) {
    return `${linkClassName || ''} typedoc-icon-label`;
  } else {
    return `${linkClassName || ''}`;
  }
}
function TOCItemTree({toc, className, linkClassName, isChild, parentValue}) {
  if (!toc.length) {
    return null;
  }
  return (
    <ul className={isChild ? undefined : className}>
      {toc.map((heading) => (
        <li key={heading.id}>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <a
            href={`#${heading.id}`}
            className={getLinkClassName(linkClassName, parentValue)}>
            {getIcon(parentValue)}
            {/*eslint-disable-next-line react/no-danger*/}
            <span dangerouslySetInnerHTML={{__html: heading.value}}></span>
          </a>
          <TOCItemTree
            isChild
            toc={heading.children}
            className={className}
            linkClassName={linkClassName}
            parentValue={heading.value}
          />
        </li>
      ))}
    </ul>
  );
}
// Memo only the tree root is enough
export default React.memo(TOCItemTree);
