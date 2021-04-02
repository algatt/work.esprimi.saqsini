<template>
  <div class="editor relative">
    <editor-menu-bar
      v-slot="{ commands, isActive, getMarkAttrs }"
      :editor="editor"
    >
      <div class="flex flex-col">
        <div class="flex flex-wrap py-2 px-1">
          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <i class="fas fa-bold fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <i class="fas fa-italic fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <i class="fas fa-strikethrough fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <i class="fas fa-underline fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
          >
            <i class="fas fa-paragraph fa-fw"></i>
          </button>

          <button
            class="menubarButton font-bold"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </button>

          <button
            class="menubarButton font-bold"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </button>

          <button
            class="menubarButton font-bold"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <i class="fas fa-list-ul fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <i class="fas fa-list-ol fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <i class="fas fa-quote-right fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
          >
            <i class="fas fa-code fa-fw"></i>
          </button>

          <button
            class="menubarButton font-bold"
            @click="commands.horizontal_rule"
          >
            HR
          </button>

          <button
            class="menubarButton"
            :class="{ 'is-active': isActive.link() }"
            @click="addUrl ? (addUrl = false) : showMenu(getMarkAttrs('link'))"
          >
            <i class="fas fa-link fa-fw"></i>
          </button>

          <button
            class="menubarButton"
            @click="showImagePrompt(commands.image)"
          >
            <i class="far fa-image fa-fw"></i>
          </button>

          <button class="menubarButton" @click="commands.undo">
            <i class="fas fa-undo fa-fw"></i>
          </button>

          <button class="menubarButton" @click="commands.redo">
            <i class="fas fa-redo fa-fw"></i>
          </button>
        </div>
        <div v-if="addUrl" class="flex justify-between px-3 w-10/12 my-2">
          <input
            v-model="linkUrl"
            placeholder="https://"
            class="flex flex-1 bg-gray-600 text-gray-300 py-1 px-1 rounded-l"
          />
          <button
            class="bg-gray-700 px-2 rounded-r"
            @click="setLinkUrl(commands.link, linkUrl)"
          >
            Apply
          </button>
        </div>
      </div>
    </editor-menu-bar>

    <editor-content class="editorContent" :editor="editor" />
  </div>
</template>

<script>
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Image,
  CodeBlockHighlight,
  Focus,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      editor: null,
      linkUrl: null,
      addUrl: false,
    }
  },
  mounted() {
    this.editor = new Editor({
      onUpdate: ({ getHTML }) => {
        this.$emit('updateContent', getHTML())
      },
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Image(),

        new CodeBlockHighlight({
          languages: {
            javascript,
            css,
          },
        }),
        new Focus({
          className: 'has-focus',
          nested: true,
        }),
      ],
      content: this.content,
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    },
    showMenu(link) {
      this.addUrl = true
      this.linkUrl = link.href ? link.href : ''
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.addUrl = false
    },
  },
}
</script>

<style lang="scss">
pre {
  &::before {
    content: attr(data-language);
    text-transform: uppercase;
    display: block;
    text-align: right;
    font-weight: bold;
    font-size: 0.6rem;
  }
  code {
    .hljs-comment,
    .hljs-quote {
      color: #999999;
    }
    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f2777a;
    }
    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #f99157;
    }
    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #99cc99;
    }
    .hljs-title,
    .hljs-section {
      color: #ffcc66;
    }
    .hljs-keyword,
    .hljs-selector-tag {
      color: #6699cc;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
  }
}

.has-focus {
  @apply outline-none;
}
</style>

<style scoped>
.editorContent {
}

.menubarButton {
  @apply px-1 mr-1 text-gray-600;
}

.is-active {
  @apply bg-primary rounded text-white;
}

.editorContent >>> a {
  @apply underline text-primary cursor-pointer px-1;
}

.editorContent >>> .ProseMirror {
  @apply p-3 focus:outline-none border-b border-gray-200 focus:border-primary transition duration-300;
}
</style>
