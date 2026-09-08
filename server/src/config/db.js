import Knex from 'knex'

import knexConfig from '../../knexfile.js'
import { env } from './env.js'

const config = knexConfig[env.nodeEnv] || knexConfig.development

export const db = Knex(config)
