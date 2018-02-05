# Simple checkout

Original from [github](https://github.com/danielpina/checkout)

A simple checkout page template, using no boilerplates or libraries.

The styling is done in Sass and compiled and minified using Gulp.

Events are built with a mix of Javascript and jQuery. The latter is embedded from Google CDN but with a local fallback.

**ToDo:** Need to run a few more tests for reponsiveness and browser support but in theory browser support should be fine because it is handled by Gulp autoprefixer.

The fonts are included via Google CDN.

The checkout page is started with the initial products quantity and users can add or remove to the quantity via the minus and plus buttons. 

**ToDo:** enable the user to enter quantity direct into the input field. Trigger tests via KeyUp Javascript event.

* If the user tries to add more than 10 items, a warning is displayed.
* The user is not able to reduce quantity lower than zero.
* The values are auto updated in the row total and the order total.
* The VAT is calculated at 20%.

The user can remove items from the basket via the remove link. The link animates an underline from left to right and if the user removes all items, a notice is displayed and the checkout button is disabled.

When the checkout button is clicked, the details of the products in the basket are displayed in the console and a message is displayed.

The Price promise bottom left corner box animates the black border when the user hover the box.

The checkout button animates the background color when the mouse hover.

**ToDo:** Use a Javascript framework/library to read the product data (collection) from a json file and dynamically output the rows