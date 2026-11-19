# Paper Books Afghanistan

A responsive bookstore landing page built with **HTML, CSS, and vanilla JavaScript**. Visitors can browse featured books, search the catalog, and manage a shopping basket.

## Features

- Welcome modal appears before the landing page and closes when the visitor clicks the button or after 20 seconds.
- Responsive layout with a mobile navigation menu.
- Search featured books by title, author, or description.
- Add books to a basket, remove them, and see the item count and total.
- Basket contents are saved in the browser's local storage.
- Prepare an order through an email link.
- Afghan afghani (AFN) prices and a newsletter sign-up demo.

> The newsletter form is a front-end demonstration and does not send or store email addresses. Placing an order opens the visitor's email application.

## Built with

- HTML5
- CSS3
- Vanilla JavaScript

There are no packages to install or build commands to run.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a browser.

For a local development server, open the project folder in Visual Studio Code and use the **Live Server** extension.

## Publish with GitHub Pages

This is a static website, so it can be hosted directly from the repository:

1. Push the project files to the `main` branch on GitHub.
2. Open the repository and go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose `main` as the branch and `/ (root)` as the folder, then select **Save**.
5. After GitHub Pages finishes deploying, use the URL shown in the Pages settings. It will usually be:

   `https://somaiamosadeq1212.github.io/bookstore/`

If the default branch is not named `main`, select the branch that contains `index.html`. The CSS, JavaScript, and image links use relative paths, so they work from the GitHub Pages project URL.

## Project structure

```text
bookstore/
├── index.html       # Page content and layout
├── style.css        # Responsive styles
├── script.js        # Navigation, search, welcome modal, and basket behavior
├── images/          # Logo and book imagery
└── README.md
```
