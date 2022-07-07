import { faker } from '@faker-js/faker';
import prisma from './config/prisma/initialize-client';

const randomName = faker.name.findName(); // Rowan Nikolaus