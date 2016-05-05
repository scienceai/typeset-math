import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import katex from 'katex';

export default function typesetMath(ComposedComponent, propName = 'content') {
  class Math extends Component {
    componentDidUpdate(prevProps, prevState) {
      if (this.props[propName] !== prevProps[propName]) {
        this.renderMath();
      }
    }

    componentDidMount() {
      this.renderMath();
    }

    renderMath() {
      const $root = findDOMNode(this);

      Array.prototype.forEach.call($root.querySelectorAll('math'), $math => {
        // document worker add an <annotation> element within <math> with the TeX content
        if ($math.parentNode.classList.contains('katex-mathml')) return;
        const $annotation = $math.querySelector('annotation');
        if (! $annotation) return;
        let opts = {
          displayMode: ($math.getAttribute('display') === 'block'),
          throwOnError: false
        };
        const target = document.createDocumentFragment();
        try {
          katex.render(fixTeX($annotation.textContent), target, opts);
          $math.parentNode.replaceChild(target, $math);
        }
        catch (e) {
          // this is the same colour as KaTeX uses for errors
          $math.setAttribute('style', 'color: rgb(204, 0, 0)');
          console.error('KaTeX error:', e);
        }
      });
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };

  Math.propTypes = {
    [propName]: PropTypes.any
  };

  return Math;
};


// some fixes we can run pre-emptively to help KaTeX handle at-times incorrect values
function fixTeX(str) {
  if (!str) return '';
  return str.replace(/(\\text\{[^}]*)π([^}]*\})/g, '$1}\\pi\\text{$2')
            .replace(/\\overrightarrow/g, '\\vec')
            .replace(/\\operatorname\{([^{}]*)\}/g, '$1');
}
