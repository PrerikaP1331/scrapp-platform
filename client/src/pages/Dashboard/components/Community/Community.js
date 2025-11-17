import React, { useEffect, useState, useContext } from 'react';
import { Container, Tabs, Card, Text, Group, Stack, Badge, Button, TextInput, Select, Title, ActionIcon, Modal, Textarea, Pagination, Avatar, Skeleton, Alert, Box, Center } from '@mantine/core';
import { IconSearch, IconMapPin, IconUsers, IconPlus, IconArrowRight, IconHeart, IconHeartFilled, IconMessageCircle, IconAlertCircle } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { AuthContext } from '../../../../context/AuthContext';
import { searchCommunities, getUserCommunities, requestJoinCommunity, getCommunityPosts, createCommunityPost, claimItem, addComment, likePost } from '../../../../api/communityService';
import styles from './Community.module.css';

// REUSABLE: Community discovery card
const CommunityCard = ({ community, onJoin, isPending, isMember }) => (
  <Card withBorder className={styles.communityCard}>
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Title order={4}>{community.name}</Title>
          <Group gap="xs" mt="xs" size="sm">
            <Group gap={4}>
              <IconMapPin size={14} />
              <Text size="sm" c="dimmed">{community.address?.city || 'Location'}</Text>
            </Group>
            <Group gap={4}>
              <IconUsers size={14} />
              <Text size="sm" c="dimmed">{community.memberCount || 0} members</Text>
            </Group>
          </Group>
        </div>
        {community.type && <Badge variant="light">{community.type}</Badge>}
      </Group>
      <Text size="sm" c="dimmed" lineClamp={2}>{community.description || 'No description'}</Text>
      <Group justify="flex-end">
        {isMember ? (
          <Badge color="green">Member</Badge>
        ) : isPending ? (
          <Badge color="yellow">Pending</Badge>
        ) : (
          <Button size="sm" onClick={onJoin} rightSection={<IconArrowRight size={16} />}>
            Join
          </Button>
        )}
      </Group>
    </Stack>
  </Card>
);

// REUSABLE: Post/Feed card for both giveaways and announcements
const PostCard = ({ post, onLike, onComment, onClaim, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const isLiked = post.likes?.includes(currentUserId);
  const isClaimed = post.status === 'claimed' || post.status === 'completed';

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      await onComment(post._id, commentText);
      setCommentText('');
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder className={styles.postCard}>
      {post.isPinned && <Badge className={styles.pinnedBadge} size="sm">📌 Pinned</Badge>}
      
      <Card.Section inheritPadding py="md">
        {/* Header: Author + Type badge */}
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <Avatar name={post.author?.name} size="sm" radius="xl" />
            <Stack gap={0}>
              <Text fw={600} size="sm">{post.author?.name}</Text>
              <Text size="xs" c="dimmed">{new Date(post.createdAt).toLocaleDateString()}</Text>
            </Stack>
          </Group>
          <Badge size="sm" color={post.type === 'giveaway' ? 'green' : 'blue'}>
            {post.type === 'giveaway' ? '🎁' : '📢'} {post.type}
          </Badge>
        </Group>

        {/* Content */}
        <Title order={5} mb="xs">{post.title}</Title>
        <Text size="sm" c="dimmed" mb="md">{post.description}</Text>

        {/* Item details for giveaways */}
        {post.itemDetails && (
          <Group gap="xs" mb="md" p="xs" bg="gray.0" style={{ borderRadius: 6 }}>
            <Badge size="sm">{post.itemDetails.condition}</Badge>
            <Badge size="sm" variant="light">{post.itemDetails.category}</Badge>
          </Group>
        )}

        {/* Actions: Like, Comment, Claim */}
        <Group justify="space-between">
          <Group gap="xs">
            <ActionIcon variant="subtle" onClick={() => onLike(post._id)} color={isLiked ? 'red' : 'gray'}>
              {isLiked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
            </ActionIcon>
            <Text size="sm">{post.likes?.length || 0}</Text>

            <ActionIcon variant="subtle" onClick={() => setShowComments(!showComments)} ml="md">
              <IconMessageCircle size={18} />
            </ActionIcon>
            <Text size="sm">{post.comments?.length || 0}</Text>
          </Group>

          {post.type === 'giveaway' && !isClaimed && (
            <Button size="xs" variant="light" color="green" onClick={() => onClaim(post._id)}>
              Claim Item
            </Button>
          )}
          {isClaimed && <Badge color="gray">Claimed</Badge>}
        </Group>
      </Card.Section>

      {/* Comments section - expandable */}
      {showComments && (
        <Card.Section inheritPadding py="md" withBorder className={styles.commentsSection}>
          <Stack gap="sm">
            {post.comments && post.comments.length > 0 && (
              <Stack gap="xs">
                {post.comments.map((c, idx) => (
                  <Group key={idx} gap="xs" p="xs" bg="gray.0" style={{ borderRadius: 6 }}>
                    <Avatar name={c.author?.name} size="xs" radius="xl" />
                    <Stack gap={0} flex={1}>
                      <Text fw={600} size="xs">{c.author?.name}</Text>
                      <Text size="sm">{c.text}</Text>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            )}
            <Group gap="xs">
              <Textarea
                placeholder="Add comment..."
                size="sm"
                value={commentText}
                onChange={(e) => setCommentText(e.currentTarget.value)}
                maxRows={2}
                flex={1}
              />
              <ActionIcon onClick={handleAddComment} loading={loading} color="blue" size="lg">
                ↓
              </ActionIcon>
            </Group>
          </Stack>
        </Card.Section>
      )}
    </Card>
  );
};

// MAIN COMPONENT
const Community = () => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postFilter, setPostFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [createPostOpened, { open: openCreatePost, close: closeCreatePost }] = useDisclosure(false);
  const [postForm, setPostForm] = useState({ type: 'giveaway', title: '', description: '', itemDetails: {} });

  useEffect(() => {
    loadUserCommunities();
  }, []);

  useEffect(() => {
    if (selectedCommunity) loadPosts();
  }, [selectedCommunity, postFilter, page]);

  const loadUserCommunities = async () => {
    try {
      const res = await getUserCommunities();
      setUserCommunities(res.data || []);
      if (res.data?.length > 0) {
        setSelectedCommunity(res.data[0]);
      }
    } catch (err) {
      console.error('Error loading communities:', err);
    }
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await searchCommunities(q);
      setSearchResults(res.data || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleJoin = async (communityId) => {
    try {
      await requestJoinCommunity(communityId);
      handleSearch(searchQuery); // Refresh results
    } catch (err) {
      console.error('Join error:', err);
    }
  };

  const loadPosts = async () => {
    if (!selectedCommunity) return;
    setLoading(true);
    try {
      const res = await getCommunityPosts(selectedCommunity._id, {
        type: postFilter === 'all' ? undefined : postFilter,
        page,
      });
      setPosts(res.data?.posts || []);
      setMaxPage(res.data?.pages || 1);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postForm.title.trim() || !selectedCommunity) return;
    try {
      await createCommunityPost(selectedCommunity._id, postForm);
      loadPosts();
      closeCreatePost();
      setPostForm({ type: 'giveaway', title: '', description: '', itemDetails: {} });
    } catch (err) {
      console.error('Create post error:', err);
    }
  };

  const hasJoinedCommunities = userCommunities.length > 0;

  return (
    <Container size="lg" py="xl">
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="discover" leftSection={<IconSearch size={14} />}>
            Discover
          </Tabs.Tab>
          {hasJoinedCommunities && (
            <Tabs.Tab value="hub" leftSection={<IconUsers size={14} />}>
              My Communities
            </Tabs.Tab>
          )}
        </Tabs.List>

        {/* ===== STATE 1: DISCOVERY ===== */}
        <Tabs.Panel value="discover" py="md">
          <Stack gap="lg">
            {/* Header + CTA */}
            <Box>
              <Title order={2} mb="sm">Find & Join a Community</Title>
              <Text c="dimmed" mb="md">
                Unlock exclusive features like item sharing and local event notifications by joining a community!
              </Text>
              <TextInput
                placeholder="Search by community name or postal code..."
                icon={<IconSearch size={18} />}
                value={searchQuery}
                onChange={(e) => handleSearch(e.currentTarget.value)}
                size="md"
              />
            </Box>

            {/* Results */}
            {searchQuery && (
              <>
                {searchResults.length > 0 ? (
                  <Stack gap="md">
                    {searchResults.map((c) => (
                      <CommunityCard
                        key={c._id}
                        community={c}
                        onJoin={() => handleJoin(c._id)}
                        isPending={c.hasPendingRequest}
                        isMember={c.isMember}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Alert icon={<IconAlertCircle size={16} />} color="blue">
                    No communities found. Try a different search.
                  </Alert>
                )}
              </>
            )}

            {!searchQuery && (
              <Center py="xl">
                <Text c="dimmed">Start searching to find communities near you</Text>
              </Center>
            )}
          </Stack>
        </Tabs.Panel>

        {/* ===== STATE 2: HUB (MEMBER VIEW) ===== */}
        {hasJoinedCommunities && (
          <Tabs.Panel value="hub" py="md">
            <Stack gap="lg">
              {/* Header with "Find More" CTA */}
              <Group justify="space-between">
                <Title order={2}>My Communities</Title>
                <Button leftSection={<IconPlus size={18} />} size="sm" variant="light" onClick={() => setActiveTab('discover')}>
                  Find More
                </Button>
              </Group>

              {/* Community Tabs Navigation */}
              <Tabs value={selectedCommunity?._id} onChange={(id) => {
                const comm = userCommunities.find(c => c._id === id);
                setSelectedCommunity(comm);
                setPage(1);
                setPostFilter('all');
              }}>
                <Tabs.List>
                  {userCommunities.map((c) => (
                    <Tabs.Tab key={c._id} value={c._id} label={c.name} />
                  ))}
                </Tabs.List>

                {/* Community Tab Content */}
                {selectedCommunity && (
                  <Tabs.Panel value={selectedCommunity._id} py="md">
                    <Stack gap="lg">
                      {/* Community Header */}
                      <Group justify="space-between" align="flex-start">
                        <Box>
                          <Title order={2}>{selectedCommunity.name}</Title>
                          <Text c="dimmed" size="sm">{selectedCommunity.description}</Text>
                        </Box>
                        <Button leftSection={<IconPlus size={18} />} onClick={openCreatePost}>
                          Post New Item
                        </Button>
                      </Group>

                      {/* Filter buttons */}
                      <Group gap="xs">
                        {['all', 'giveaway', 'announcement'].map((type) => (
                          <Badge
                            key={type}
                            onClick={() => { setPostFilter(type); setPage(1); }}
                            className={styles.filterBadge}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: postFilter === type ? '#51CF66' : '#f0f0f0',
                              color: postFilter === type ? 'white' : 'black',
                            }}
                          >
                            {type === 'all' ? 'All Posts' : type === 'giveaway' ? 'Items for Giveaway' : 'Announcements'}
                          </Badge>
                        ))}
                      </Group>

                      {/* Posts Feed */}
                      {loading ? (
                        <Stack gap="md">
                          {[1, 2, 3].map((i) => <Skeleton key={i} height={150} radius="md" />)}
                        </Stack>
                      ) : posts.length > 0 ? (
                        <>
                          <Stack gap="md">
                            {posts.map((p) => (
                              <PostCard
                                key={p._id}
                                post={p}
                                onLike={() => { likePost(p._id).then(() => loadPosts()); }}
                                onComment={addComment}
                                onClaim={() => { claimItem(p._id).then(() => loadPosts()); }}
                                currentUserId={user?.id}
                              />
                            ))}
                          </Stack>
                          {maxPage > 1 && (
                            <Center mt="xl">
                              <Pagination value={page} onChange={setPage} total={maxPage} size="sm" />
                            </Center>
                          )}
                        </>
                      ) : (
                        <Alert icon={<IconAlertCircle size={16} />} color="blue">
                          No posts yet. Be the first to share!
                        </Alert>
                      )}
                    </Stack>
                  </Tabs.Panel>
                )}
              </Tabs>
            </Stack>
          </Tabs.Panel>
        )}
      </Tabs>

      {/* CREATE POST MODAL */}
      <Modal opened={createPostOpened} onClose={closeCreatePost} title="Create a New Post" size="md">
        <Stack gap="md">
          <Select
            label="Post Type"
            placeholder="Select type"
            data={[
              { value: 'giveaway', label: '🎁 Give Away an Item' },
              { value: 'announcement', label: '📢 Announcement' },
            ]}
            value={postForm.type}
            onChange={(v) => setPostForm({ ...postForm, type: v || 'giveaway' })}
          />
          <TextInput
            label="Title"
            placeholder="What is it?"
            value={postForm.title}
            onChange={(e) => setPostForm({ ...postForm, title: e.currentTarget.value })}
          />
          <Textarea
            label="Description"
            placeholder="Details about the item or announcement..."
            minRows={3}
            value={postForm.description}
            onChange={(e) => setPostForm({ ...postForm, description: e.currentTarget.value })}
          />
          {postForm.type === 'giveaway' && (
            <>
              <Select
                label="Item Condition"
                placeholder="Select condition"
                data={[
                  { value: 'like-new', label: 'Like New' },
                  { value: 'good', label: 'Good' },
                  { value: 'fair', label: 'Fair' },
                ]}
                value={postForm.itemDetails?.condition || ''}
                onChange={(v) => setPostForm({ ...postForm, itemDetails: { ...postForm.itemDetails, condition: v } })}
              />
              <TextInput
                label="Item Category"
                placeholder="e.g., Furniture, Electronics, Books"
                value={postForm.itemDetails?.category || ''}
                onChange={(e) => setPostForm({ ...postForm, itemDetails: { ...postForm.itemDetails, category: e.currentTarget.value } })}
              />
            </>
          )}
          <Group justify="flex-end">
            <Button variant="light" onClick={closeCreatePost}>Cancel</Button>
            <Button onClick={handleCreatePost}>Post</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default Community;
