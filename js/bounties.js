const queryProjects = async (options) => {
  const combine = options.combine || false
  const labels = options.labels || ['bounty']
  const state = options.state || 'all'
  const projects = options.projects || []

  const urls = projects.map(project => {
    return `https://api.github.com/repos/${project}/issues?labels=${labels.join(',')}&state=${state}`
  })

  const tasks = urls.map(url => {
    return axios.get(url)
  })

  try {
    const results = await Promise.all(tasks)
    const resultDatas = results.map(result => {
      return result.data
    })
    if (combine) {
      // console.log(JSON.stringify([].concat(...resultDatas), null, 2))
      return [].concat(...resultDatas)
    } else {
      return resultDatas
    }
  } catch (e) {
    console.log(e)
    return []
  }
}
