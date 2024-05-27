const weaviatejs = require('weaviate-client');

export interface PersonImage {
  filename: string
  image: string
  name: string
  certainty: number | null | undefined
}

export class WeaviateClientJS {
  private client: any
  constructor() {
    this.client = weaviatejs.client({
      scheme: 'http',
      host: 'localhost:8080',
    })
  }

  public async findImages(): Promise<PersonImage[]> {
    const results = await this.client.graphql
        .get()
        .withClassName('FaceRecognition')
        .withFields('filename image name')
        .do()
    return this.toPersonImage(results)
  }

  public async findImage(img: string): Promise<PersonImage[]> {
    if (img && img.length > 0) {
      const results = await this.client.graphql
          .get()
          .withClassName('FaceRecognition')
          .withNearImage({image: img})
          .withFields('filename image name _additional{ certainty }')
          .withLimit(1)
          .do()
      return this.toPersonImage(results)
    }
    return []
  }

  private toPersonImage(results: any): PersonImage[] {
    const personImages: any[] = results['data']['Get']['FaceRecognition'] as any[]
    let images: PersonImage[] = []
    personImages.forEach(pi => {
      let certainty: number | undefined
      if (pi['_additional']) {
        certainty = pi['_additional']['certainty'] as number
      }
      images.push({
        filename: pi['filename'],
        image: pi['image'],
        name: pi['name'],
        certainty: certainty
      })
    })
    return images
  }
}
