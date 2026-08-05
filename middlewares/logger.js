
const logger = (req,res,next) => {
  const timestamp = new Date().toISOString();
  console.log(`A ${req.method} request has been made on ${req.url} at ${timestamp} from ${req.ip}`);
next();
}; 

module.exports =  logger ;
