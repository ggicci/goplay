export type CompilerEvent = {
  Delay: number // in nanoseconds
  Kind: string
  Message: string
}

export type CompilerResponse = {
  Errors: string
  Events: CompilerEvent[] | null
}

export type CompilerVersion = 'gopre' | 'gotip'

const sleep = (n: number) => new Promise((res) => setTimeout(res, n))

export class GoPlayProxy {
  constructor(public proxyUrl: string = '/goplay') {}

  async raiseForStatus(resp: Response): Promise<void> {
    if (!resp.ok) {
      const message = await resp.text()
      throw new Error(message ? resp.statusText + ': ' + message : resp.statusText)
    }
  }

  public async compile(sourceCode: string, goVersion?: CompilerVersion): Promise<CompilerResponse> {
    const form = new FormData()
    form.append('version', '2')
    form.append('withVet', 'true')
    form.append('body', sourceCode)

    const resp = await fetch(`${this.proxyUrl}/_/compile?backend=${goVersion || ''}`, {
      method: 'POST',
      body: form,
    })
    await this.raiseForStatus(resp)
    return await resp.json()
  }

  public async renderCompile(container: HTMLElement, sourceCode: string, goVersion?: CompilerVersion): Promise<void> {
    container.replaceChildren(this.renderMessage('system', 'Waiting for remote server...'))
    const js = await this.compile(sourceCode, goVersion)

    // Clear output.
    container.replaceChildren()

    // Render build error.
    if (js.Errors != '') {
      container.appendChild(this.renderMessage('error', js.Errors))
      container.appendChild(this.renderMessage('system', '\nGo build failed.'))
      return
    }

    // Render events.
    for (const event of js.Events || []) {
      container.appendChild(await this.renderEvent(event))
    }

    container.appendChild(this.renderMessage('system', '\nProgram exited.'))
  }

  async renderEvent(e: CompilerEvent): Promise<HTMLSpanElement> {
    if (e.Delay >= 0) {
      await sleep(e.Delay / 1000000)
    }

    return this.renderMessage(e.Kind, e.Message)
  }

  renderMessage(kind: string, message: string): HTMLSpanElement {
    const output = document.createElement('span')
    output.classList.add(kind)
    output.innerText = message
    return output
  }

  public async share(sourceCode: string, goVersion?: CompilerVersion): Promise<string> {
    const resp = await fetch(`${this.proxyUrl}/_/share`, {
      method: 'POST',
      body: sourceCode,
    })
    await this.raiseForStatus(resp)
    const canonical = 'https://go.dev/play/p/' + (await resp.text())
    return goVersion ? `${canonical}?v=${goVersion}` : canonical
  }
}
