Vue.component('bounty-item', {
  props: ['issue'],
  template: `
    <div class="bounty-item" :class="{ closed: issue.state === 'closed' }">
      <div class="inner">
        <div class="title row">
          <a :href="issue.html_url">{{ issue.title }}</a>
        </div>
        <div class="row">
          <span class="project">
            {{ issue.project_name }}
          </span>
          <span v-if="label" class="label tag tag-version">
            {{ label }}
          </span>
        </div>
        <div class="row">
          <span class="status">
            {{ issue.state }}
          </span>
          <span v-if="bountyValue" class="tag bounty core-app">
            {{ bountyValue }} Æ
          </span>
        </div>
      </div>
    </div>
  `,
  computed: {
    label: function () {
      let cleanLabels = this.issue.labels.filter(label => {
        return label.name !== 'bounty'
      })
      return cleanLabels.length > 0 ? cleanLabels[0].name : null
    },
    bountyValue: function () {
      return null
    }
  }
})
