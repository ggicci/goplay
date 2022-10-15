# goplay

Embeded Go Playground on your Websites

```bash
npm install @ggicci/goplay
```

Read [goplay: Embed Go Playground on your Website](https://ggicci.me/goplay) to learn how it works.

## Use Cases

### Work with [`Hugo`](https://gohugo.io/) | [demo](https://ggicci.me/posts/goplay-embed-go-playground-on-your-website)

When working with **Hugo**, we can use `@ggicci/goplay` to render a Go code block as a readonly but runnable Go Playground widget. A [hugo shortcode](https://gohugo.io/content-management/shortcodes/) called `goplay` has already been invented.

Read [hugo-shortcode-goplay](https://ggicci.me/posts/goplay-embed-go-playground-on-your-website/#hugo-shortcode-goplay) for details to know how to use it. It should be very easy and handy.

### Work with [`Docusaurus`](https://docusaurus.io/) | [demo](https://ggicci.github.io/httpin/directives/query#run-example)

When working with **Docusaurus**, we can create a custom component to use `@ggicci/goplay` to wrap its native `CodeBlock` component with Go Playground support. Here's an example: [GoPlay.tsx](https://github.com/ggicci/httpin/blob/documentation/docs/src/components/GoPlay.tsx).

### Work with [Ghost](https://ghost.org) | [demo](https://ggicci.me/goplay-embed-go-playground-on-your-website/) | [gist](https://gist.github.com/ggicci/c85b4665e959a10fdbe0c97b33f44eb0)

### Customizations

Use `@ggicci/goplay`'s API directly. Read [use @ggicci/goplay](https://ggicci.me/posts/goplay-embed-go-playground-on-your-website/#use-ggiccigoplay) for details and sample code.


## Resources

- A Go Playground Alternative: https://goplay.tools/
