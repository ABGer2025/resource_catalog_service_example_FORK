/**
 * @file Helfer zum Anreichern eines Ressourcenobjekts mit Bewertungen & Feedback.
 */

import Resource from '../models/Resource.js';
import Rating from '../models/Rating.js';
import Feedback from '../models/Feedback.js'; 
import { toClient } from '.utils/to_client.js';

export async function buildEnrichedResource(resource) {
  const _id = resource.id;

  const [avgDoc] = await Rating.aggregate([
        { $match: { resourceId: _id } },
        { $group: { _id: null, avg: { $avg: "ratingValue" } } }
      ]);
  
      const avgRating = avgDoc?. avg ?? 0;      

  const feedback = await Feedback.find({ resourceId: _id }).lean(); 

  return {
    ...toClient(resource),
    averageRating: avgRating,
    feedback: feedback.map(toClient) 
  };
}
