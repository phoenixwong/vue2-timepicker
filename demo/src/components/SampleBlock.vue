<script>
export default {
  name: 'SampleBlock',
  props: {
    id: { type: String }
  },
  computed: {
    blockHerf () {
      if (this.id && this.id.length) {
        return `#${this.id}`
      }
      return null
    }
  }
}
</script>

<template lang="pug">
.sample-block(:id="id")
  h3.title
    a.anchor(:href="blockHerf") #
    slot(name="title")
  .description
    slot(name="description")
  .codes
    slot(name="codes")
  .preview
    slot(name="preview")
  .codes(v-if="$slots.data")
    slot(name="data")
</template>

<style lang="stylus">
.sample-block
  padding: 5em 0 0 20%
  &:first-of-type
    padding-top: 0

  .title
    position: relative
    margin-bottom: 1.5em

    a.anchor
      position: absolute
      left: -1em

  .description,
  .preview,
  .codes
    margin-left: 1.5em

  .inline-data-preview
    display: inline-block
    margin-left: 1em
    font-size: 0.9em
  
  ul
    margin: 0 0 1em 0
    padding: 0 0 0 1.2em
    li
      list-style: circle
      line-height: 150%
</style>
