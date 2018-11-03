title: Pain in the nest
date: 2018-10-16 19:25:00
tags:
- Web Development
- CSS
- BEM
---

### Intro 

BEM is a naming convention and set of rules to help make more matainable and reasonable styling. You can find the rules here (getbem) what we will look at is why these rules exist.

### The cascade and spececifity

Before we start we need to understand how CSS rules are applied. At a fundamental level a style sheet is made of a selectors that finds DOM nodes that match the selector and styling rules to be applied to those DOM nodes.

```css
.selector {
  styling-property: value;
}
```

The browser gives each element in the selector a score, that score is then used to workout what order the rules in each selector are applied to the matching DOM nodes.

The scores are an id is 100, a class is 10 and a node type is 1.



### Nesting



### The rules

### Breaking the rules


### Notes
The first commit to the OOCSS repo was [https://github.com/stubbornella/oocss/](https://github.com/stubbornella/oocss/) on Jan 28, 2009. This started the trend and journey that modular CSS.

The BEM repo started 5 years later.

Nesting
