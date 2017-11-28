import { bind } from '../index'

const elem = document.getElementById('target')

const model = {
  description: 'Whats up',
  greet: (name: string) => `Hello, ${name}!`,
  title: 'Hey!'
}

bind(elem!, model)
