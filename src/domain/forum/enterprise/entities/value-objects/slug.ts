export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalize it as a slug
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {srting}
   */

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Transforma '_' espaços em branco em '-'
      .replace(/[^\w-]+/g, '') // Remove o que não são palavras
      .replace(/_/g, '-') // Transforma '_' em '-'
      .replace(/--+/g, '-') // Transforma '--' em '-'
      .replace(/-$/g, '-') // Remove '-' do fim do text

    return new Slug(slugText)
  }
}
