import { Router } from 'express';
import { createUser, getUser, updateUserTopics } from '../controllers/user.controller';
import { listTopics } from '../controllers/topic.controller';
import { ingestArticles, listArticles, summarizeArticle } from '../controllers/article.controller';
import { getFeed } from '../controllers/feed.controller';
import { createInteraction } from '../controllers/interaction.controller';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ message: 'API is healthy' });
});

router.post('/users', createUser);
router.get('/users/:userId', getUser);
router.post('/users/:userId/topics', updateUserTopics);

router.get('/topics', listTopics);

router.post('/ingest', ingestArticles);
router.get('/articles', listArticles);
router.post('/articles/:articleId/summarize', summarizeArticle);
router.post('/articles/:articleId/interactions', createInteraction);

router.get('/feed', getFeed);

export default router;
