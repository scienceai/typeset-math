
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default function typesetMath (ComposedComponent, propName = 'content') {
  class Math extends Component {
    componentDidMount () {
      this.renderMath();
    }
    componentDidUpdate (prevProps) {
      if (this.props[propName] !== prevProps[propName]) {
        this.renderMath();
      }
    }
    renderMath () {
      fixTypesetting(findDOMNode(this));
    }
    render () {
      return <ComposedComponent {...this.props} />;
    }
  }
  Math.propTypes = {
    [propName]: PropTypes.any,
  };
  return Math;
}

export function fixTypesetting ($root) {
  Array.from($root.querySelectorAll('span[role="math"] > svg'))
    .forEach($svg => {
      try {
        let h = parseFloat($svg.getAttribute('height'))
          , vb = ($svg.getAttribute('viewBox') || '').split(/\s+/).map(parseFloat)
        ;
        if (!h || !vb.length) return;
        // vertical-align = (vb-height + vb-y) / (vb-height / height)
        let va = (vb[3] / vb[1]) / (vb[3] / h);
        $svg.style.verticalAlign = `${va}ex`;
      }
      catch (e) {
        console.error(`Typesetting error: ${e}`);
      }
    })
  ;
}
