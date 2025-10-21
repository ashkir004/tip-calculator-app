# Frontend Mentor - Tip calculator app solution

This is a solution to the [Tip calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/tip-calculator-app-ugJNGbJUX). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)
- [Acknowledgments](#acknowledgments)


## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Calculate the correct tip and total cost of the bill per person

### Screenshot

![](/screenshots/mobile.png)
![](/screenshots/mobile-with-input.png)
![](/screenshots/tablet.png)
![](/screenshots/tablet-with-input.png)
![](/screenshots/desktop.png)
![](/screenshots/desktop-with-input.png)
![](/screenshots/error-states.png)


### Links

- Solution URL: [https://github.com/ashkir004/tip-calculator-app](https://github.com/ashkir004/tip-calculator-app)
- Live Site URL: [https://tip-calculator-ashkir004.netlify.app/](https://tip-calculator-ashkir004.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Javascript (Vanilla)
- Regular Expressions

### What I learned

```js
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  tipAmountPerPerson = formatter.format(tipAmountPerPerson);
  totalSplitPerPerson = formatter.format(totalSplitPerPerson);

```

### Continued development

- Regular Expressions
- Reusable Input Validation with edge-case handling
- Improve accessibility for error messages and inputs


## Author

- Frontend Mentor - [@ashkir004](https://www.frontendmentor.io/profile/ashkir004)
- Github - [@ashkir004](https://www.github.com/ashkir004)


## Acknowledgments

- [Frontendmentor](https://www.frontendmentor.io)

