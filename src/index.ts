export type CompilerEvent = {
  Delay: number
  Kind: string
  Message: string
}

export type CompilerResponse = {
  Errors: string
  Events: CompilerEvent[] | null
}

export type CompilerVersion = 'gopre' | 'gotip'

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

  public async renderCompile(sourceCode: string, goVersion?: CompilerVersion): Promise<HTMLElement> {
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.classList.add('text')
    const js = await this.compile(sourceCode, goVersion)
    const stdout = document.createElement('span')
    stdout.classList.add('stdout')
    const stderr = document.createElement('span')
    stderr.classList.add('stderr')
    const system = document.createElement('span')
    system.classList.add('system')

    if (js.Errors != '') {
      stderr.innerText = js.Errors
    } else {
      system.innerText = 'Program exited.'
    }

    if (js.Events === null) {
      if (js.Errors != '') {
        system.innerText = 'Go build failed.'
      }
    }

    for (const event of js.Events || []) {
      // TODO: what is Delay used for?
      switch (event.Kind) {
        case 'stdout':
          stdout.innerText += event.Message
          break
        case 'stderr':
          stderr.innerText += event.Message
          break
        case 'system':
          system.innerText += event.Message
          break
      }
    }

    code.appendChild(stderr)
    code.appendChild(stdout)
    code.appendChild(system)
    pre.appendChild(code)
    return pre
  }

  renderPlaintext(text: string): HTMLElement {
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.classList.add('text')
    code.innerText = text
    pre.appendChild(code)
    return pre
  }

  public async renderCompileTo(container: HTMLElement, sourceCode: string, goVersion?: CompilerVersion): Promise<void> {
    container.replaceChildren(this.renderPlaintext('Waiting for remote server...'))

    try {
      const output = await this.renderCompile(sourceCode, goVersion)
      container.replaceChildren(output)
    } catch (error) {
      container.replaceChildren(this.renderPlaintext(String(error)))
    }
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

globalThis.GoPlay = GoPlayProxy
