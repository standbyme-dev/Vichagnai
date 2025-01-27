import { Component } from 'solid-js'
import PageHeader from '/web/shared/PageHeader'
import { markdown } from '/web/shared/markdown'

const NovelGuide: Component = () => {
  return (
    <>
      <PageHeader title="NovelAI Guide"></PageHeader>
      <div class="markdown" innerHTML={markdown.makeHtml(text)}></div>
    </>
  )
}

const text = `
# Novel Instructions

There are two methods to setup NovelAI:

**Login using your email and password in the [NovelAI Settings Page](/settings?tab=ai&service=novelai).**

or

**Manually retrieve your token from the NovelAI site using the Developer Tools.**

1. Login to [Novel AI](https://novelai.net/stories)
2. Open the Developer Tools using one of the following methods:

   - \`Ctrl + Shift + I\`
   - Right click the page --> Click _Inspect_

3. Open the \`Console\` tab and type:

- \`console.log(JSON.parse(localStorage.getItem('session')).auth_token)\`

4. Copy/paste the resulting output into the \`Novel API Key\` field in your [NovelAI Settings Page](/settings?tab=ai&service=novelai)

The API Key will look something like this:

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ii4uLiIsImlhdCI6MTUxNjIzOTAyMn0.pCVUFONBLI_Lw3vKQG6ykCkuWNeG4cDhdEqRO_QJbh4
\`\`\`
`

export default NovelGuide
