 const configServer = {
  rtmp: {
    port: process.env.PORT,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: process.env.PORT1,
    allow_origin: "*",
  },
};

export default configServer