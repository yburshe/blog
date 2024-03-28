---
title: 2 Reasons Why I Built My Own Blog Engine
date: 2024-03-28
---

Building this Blog Engine was one of the first things I needed to sort out while building my website.
Previously, I've used frameworks like Hugo, Next.js and Wordpress to attach a blog to my website, however, 2 main reasons kept me from doing the same this time.
1. Customization
2. Integration

## Customization
I'm particularly particular about design, and preset themes usually do not fancy me much. I lean towards more functional and minimal themes, where I don't mind clutter as long as it is organised well. These kinds of themes where very hard to find. The landscape for sites using Wordpress have changed over the last decade, going from blogging platforms to full blown e-commerce websites, which makes it all the more difficult to find good themes dedicated to blogging.

I could always create my own theme for Wordpress or the likes, but I saw this as a good effort in writing some Javascript and Nodejs code.

## Integration
When I wrote I attached a blog to my website, I meant it literally. The blog functioned as an appendage, residing inside a directory `blog/` inside my root `var/www/` folder.
Now whenever I chose a theme for my blog, I would have to either change my website's theme to match the blog more closely or mess with the god awful Wordpress custom CSS editor. 
> I desired a blog that would act as a node in my network, not one that behaved like its own network.

## What I Finally Did

### `Markdown` + `Express` + `EJS`

I've previously worked with EJS on various projects, most recently, [steam2csv](https://steam2csv.yashburshe.com). EJS seamlessly handles dynamic rendering of HTML using JavaScript, making it perfect for smaller projects.

Markdown is a godsend for applications like this. It's easy to edit files directly and highly extensible. I utilized a library called Marked to convert my Markdown files into HTML pages, which were then served.

Additionally, I implemented customizable slugs using the Markdown file names. Currently, the metadata in the Markdown files only includes the Title and the Date, but in the future, I plan to add more metadata, including custom slugs.

## What does the Future hold?

I intend to make this engine available to everyone by hosting it on Github as a standalone app. Currently, it is available on my Github as part of my entire website's repository.

Furthermore, I plan to transition from editing raw Markdown files to implementing a simple Rich Text Editor or a WYSIWYG Editor to simplify blog post creation. This will also involve creating an admin panel to perform CRUD operations on the blog.

With enough time and motivation, I also aim to develop a tagging system and an archival system to easily retrieve blog posts based on the Month, Date, or Year, as well as through tag filters/search.

Thank you for taking the time to read through this blog post. Feel free to direct your questions and/or suggestions about this blog post and the blog engine to bursheyash2 [at] gmail [dot] com!
