<template>
  <Div>
    <div v-if="editor">
      <div class="space-x-2 flex items-center mb-2">
        <div v-if="enableEmailFields" class="relative">
          <button @click="showTagMenu = true">
            <i class="fas fa-user-tag fa-fw"></i>
          </button>

          <div
            v-if="showTagMenu"
            class="fixed top-0 left-0 w-full h-full z-20"
            @click.stop="showTagMenu = false"
          ></div>

          <div
            v-if="showTagMenu"
            class="absolute flex flex-wrap top-8 border border-gray-100 transition duration-300 p-3 shadow z-30 bg-white"
            style="max-width: 340px; min-width: 340px"
          >
            <button
              v-for="(item, index) in NOTIFICATION_EDITOR_FIELDS"
              :key="index"
              class="border rounded border-gray-200 text-sm px-1 py-0.5 bg-gray-100 mr-1 mb-1 cursor-pointer hover:bg-gray-200"
              @click.stop="
                editor.chain().insertContent(`[${item}]`).focus().run()
                showTagMenu = false
              "
            >
              {{ item }}
            </button>
          </div>
        </div>
        <button
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <i class="fas fa-bold fa-fw"></i>
        </button>
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <i class="fas fa-italic fa-fw"></i>
        </button>
        <button
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <i class="fas fa-underline fa-fw"></i>
        </button>
        <button
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <i class="fas fa-strikethrough fa-fw"></i>
        </button>

        <button @click="editor.chain().focus().unsetAllMarks().run()">
          <i class="fas fa-remove-format fa-fw"></i>
        </button>

        <button
          :class="{ 'is-active': editor.isActive('paragraph') }"
          @click="editor.chain().focus().setParagraph().run()"
        >
          <i class="fas fa-paragraph fa-fw"></i>
        </button>
        <button
          class="font-bold px-0.5"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          H1
        </button>
        <button
          class="font-bold px-0.5"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          H2
        </button>
        <button
          class="font-bold px-0.5"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          H3
        </button>
        <button
          class="font-bold px-0.5"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        >
          H4
        </button>
        <button
          class="font-bold px-0.5"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        >
          H5
        </button>
        <button
          class="font-bold px-0.5"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        >
          H6
        </button>
        <button
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <i class="fas fa-list-ul fa-fw"></i>
        </button>
        <button
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <i class="fas fa-list-ol fa-fw"></i>
        </button>

        <button
          :class="{ 'is-active': editor.isActive('link') }"
          @click="setLink"
        >
          <i class="fas fa-link fa-fw"></i>
        </button>
        <button
          v-if="editor.isActive('link')"
          @click="editor.chain().focus().unsetLink().run()"
        >
          <i class="fas fa-unlink fa-fw"></i>
        </button>

        <button @click="editor.chain().focus().setHorizontalRule().run()">
          <i class="fas fa-ruler-horizontal fa-fw"></i>
        </button>

        <button @click="editor.chain().focus().undo().run()">
          <i class="fas fa-undo-alt fa-fw"></i>
        </button>
        <button @click="editor.chain().focus().redo().run()">
          <i class="fas fa-redo-alt fa-fw"></i>
        </button>
      </div>
      <editor-content
        v-model="localContent"
        :editor="editor"
      ></editor-content></div
  ></Div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import { defaultExtensions } from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { NOTIFICATION_EDITOR_FIELDS } from '~/assets/settings/survey-settings'

export default {
  components: { EditorContent },
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
    enableEmailFields: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      editor: null,
      linkUrl: null,
      addUrl: false,
      localContent: '',
      NOTIFICATION_EDITOR_FIELDS,
      showTagMenu: false,
    }
  },
  mounted() {
    this.localContent = this.content
    this.editor = new Editor({
      extensions: [Link, Image, Underline, ...defaultExtensions()],
      content: this.localContent,
      onUpdate: () => {
        this.localContent = this.editor.getHTML()
        this.$emit('updateContent', this.localContent)
      },
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    setLink() {
      const url = window.prompt('URL')
      this.editor.chain().focus().setLink({ href: url }).run()
    },
  },
}
</script>

<style lang="scss">
.is-active {
  @apply bg-primary text-white rounded;
}
/* Basic editor styles */
.ProseMirror:focus {
  @apply border-primary transition duration-300 outline-none;
}
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  @apply border-2 border-gray-300 rounded transition duration-300 p-4;
  min-height: 150px;

  a {
    @apply text-primary underline;
  }

  ul {
    padding-left: 4rem;
    list-style-type: disc;
  }

  ol {
    padding-left: 4rem;
    list-style-type: decimal;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }
}
</style>
