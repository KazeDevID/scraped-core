# scraped-core

> Serves to scrape the core of the website.

















## :cloud: Installation

```sh
# Using npm
npm install --save scraped-core

# Using yarn
yarn add scraped-core
```













## :clipboard: Example



```js
const scrapedCore = require("scraped-core")

// Promise interface
const data = scrapedCore(`
    <h1 class='heading'>Hello World</h1>
    <img src="test.jpg" />
    <p>Test</p>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li><i>6</i></li>
    </ul>
`, {
    title: ".heading"
  , desc: "p"
  , avatar: {
        selector: "img"
      , attr: "src"
    }
  , items: {
        listItem: "ul > li"
      , data: {
            content: {
                how: "text"
            }
        }
    }
})

console.log(data)
// { title: 'Hello World',
//   desc: 'Test',
//   avatar: 'test.jpg',
//   items:
//    [ { content: '1' },
//      { content: '2' },
//      { content: '3' },
//      { content: '4' },
//      { content: '5' },
//      { content: '6' } ] }
```











## :question: Get Help

There are few ways to get help:



 1. Please [post questions on Stack Overflow](https://stackoverflow.com/questions/ask). You can open issues with questions, as long you add a link to your Stack Overflow question.
 2. For bug reports and feature requests, open issues. :bug:


## :memo: Documentation


### `scrapedCore($, opts)`
Scrapes the data in the provided element.

For the format of the selector, please refer to the [Selectors section of the Cheerio library](https://github.com/cheeriojs/cheerio#-selector-context-root-)

#### Params

- **Cheerio|String** `$`: The input element or the HTML as a string.
- **Object** `opts`: An object containing the scraping information.
  If you want to scrape a list, you have to use the `listItem` selector:

   - `listItem` (String): The list item selector.
   - `data` (Object): The fields to include in the list objects:
      - `<fieldName>` (Object|String): The selector or an object containing:
         - `selector` (String): The selector.
         - `convert` (Function): An optional function to change the value.
         - `how` (Function|String): A function or function name to access the
           value.
         - `attr` (String): If provided, the value will be taken based on
           the attribute name.
         - `trim` (Boolean): If `false`, the value will *not* be trimmed
           (default: `true`).
         - `closest` (String): If provided, returns the first ancestor of
           the given element.
         - `eq` (Number): If provided, it will select the *nth* element.
         - `texteq` (Number): If provided, it will select the *nth* direct text child.
           Deep text child selection is not possible yet.
           Overwrites the `how` key.
         - `listItem` (Object): An object, keeping the recursive schema of
           the `listItem` object. This can be used to create nested lists.

  **Example**:
  ```js
  {
     articles: {
         listItem: ".article"
       , data: {
             createdAt: {
                 selector: ".date"
               , convert: x => new Date(x)
             }
           , title: "a.article-title"
           , tags: {
                 listItem: ".tags > span"
             }
           , content: {
                 selector: ".article-content"
               , how: "html"
             }
           , traverseOtherNode: {
                 selector: ".upperNode"
               , closest: "div"
               , convert: x => x.length
             }
         }
     }
  }
  ```

  If you want to collect specific data from the page, just use the same
  schema used for the `data` field.

  **Example**:
  ```js
  {
       title: ".header h1"
     , desc: ".header h2"
     , avatar: {
           selector: ".header img"
         , attr: "src"
       }
  }
  ```

#### Return
- **Object** The scraped data.














## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :sparkling_heart: Support my projects
I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).



Thanks!










## License

[MIT][license] © [KazeDevID][website]






[license]: /LICENSE
[website]: https://github.com/KazeDevID