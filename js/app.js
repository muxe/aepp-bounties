var app = new Vue({
  el: '#app',
  data: {
    issues: [],
    loading: false,
    projects: [
      'muxe/treasure',
      'aeternity/aepp-sdk-js',
      'aeternity/aepp-sdk-python',
      'aeternity/protocol',
      'aeternity/aepp-blockchain-explorer',
      'aeternity/aepp-voting',
      'aeternity/aepp-wall',
      'aeternity/aepp-response',
      'aeternity/id-manager-provider',
      'aeternity/epoch',
      'aeternity/aepp-components',
      'aeternity/aepp-identity',
      'aeternity/aepp-aexistence'
    ],
    sort: {
      field: 'created_timestamp',
      rising: false
    },
    filter: ''
  },
  computed: {
    displayIssues: function () {
      // remove PRs
      let issues = this.issues.filter(issue => issue.pull_request === undefined)
      // enrich fields
      issues = issues.map(issue => {
        issue.project_name = this.getProject(issue.html_url)
        issue.created_timestamp = moment(issue.created_at).unix()
        issue.updated_timestamp = moment(issue.updated_at).unix()
        return issue
      })
      // filter issues
      if (this.filter && this.filter !== '') {
        issues = issues.filter(issue => {
          const filter = this.filter.toLowerCase()
          return issue.project_name.toLowerCase().includes(this.filter) ||
            issue.title.toLowerCase().includes(this.filter)
        })
      }
      // sort issues
      issues.sort((a, b) => {
        if (a[this.sort.field] < b[this.sort.field]) {
          return this.sort.rising ? -1 : 1
        }
        if (a[this.sort.field] > b[this.sort.field]) {
          return this.sort.rising ? 1 : -1
        }

        return 0
      })
      return issues
    }
  },
  methods: {
    updateIssues: async function () {
      this.loading = true
      try {
        const options = {
          combine: true,
          // state: 'open',
          // labels: ['bounty'],
          labels: [],
          projects: this.projects
        }
        const issues = await queryProjects(options)
        this.issues = issues
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    getProject: function (value) {
      const regex = /github\.com\/[^\/]+\/([^\/]+)/g
      const matches = regex.exec(value)
      if (matches && matches.length > 1) {
        return matches[1]
      }
      return ''
    },
    setSort: function (field) {
      if (this.sort.field === field) {
        this.sort.rising = !this.sort.rising
      } else {
        this.sort.rising = true
      }
      this.sort.field = field
    }
  },
  mounted () {
    this.updateIssues()
  },
  filters: {
    timeAgo: function (value) {
      return moment(value).fromNow()
    }
  }
})
