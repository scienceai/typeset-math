
# typeset-math

A React HoC or function that correct mathematical typesetting.

Usage as a HoC:

```js
import typesetMath from '@scienceai/typeset-math';
…
export default typesetMath(ReactComponentWithMathInside)
```

Usage as a function:

```js
import { fixTypesetting } from '@scienceai/typeset-math';
…
fixTypesetting($someDOMElement);
```

It will apply to all the descendants of that element; it can be called idempotently.
