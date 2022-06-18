provider "aws" {
  version = "~> 3.0"
  region  = "us-west-2"
  profile = "default"
}

data "aws_caller_identity" "current" {
}

resource "aws_s3_bucket" "bucket" {
  bucket = "course-microfrontends-bucket"
  tags   = {
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "delete_after_seven_days" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    id = "delete_after_seven-days"

    expiration {
      days = 7
    }

    status = "Enabled"
  }
}

resource "aws_s3_bucket_acl" "acl" {
  bucket = aws_s3_bucket.bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "allow_read_access" {
  bucket = aws_s3_bucket.bucket.id
  policy = templatefile("templates/s3-policy.json", { bucket = aws_s3_bucket.bucket.bucket })
}

resource "aws_s3_bucket_website_configuration" "microfrontends" {
  bucket = aws_s3_bucket.bucket.bucket

  index_document {
    suffix = "index.html"
  }
}

# ---

resource "aws_iam_user" "user" {
  name = "service_account_${aws_s3_bucket.bucket.bucket}"
}

resource "aws_iam_access_key" "user_keys" {
  user = aws_iam_user.user.name
}

resource "aws_iam_user_policy" "s3" {
  name = "service_account_s3_policy"
  user = aws_iam_user.user.name

  policy = templatefile("templates/iam-user-role-s3.json", {
    bucket = aws_s3_bucket.bucket.bucket
  })
}

resource "aws_iam_user_policy" "cloud_front" {
  name = "service_account_cloud_front_policy"
  user = aws_iam_user.user.name

  policy = templatefile("templates/iam-user-role-cloudfront.json", {
    project      = data.aws_caller_identity.current.account_id
    distribution = aws_cloudfront_distribution.www_s3_distribution.id
  })
}

output "secret" {
  value = aws_iam_access_key.user_keys.encrypted_secret
}

resource "aws_cloudfront_distribution" "www_s3_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.bucket.bucket}.s3.${aws_s3_bucket.bucket.region}.amazonaws.com"
    origin_id   = "S3-www.${aws_s3_bucket.bucket.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = false
  default_root_object = "/container/latest/index.html"

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 403
    response_code         = 200
    response_page_path    = "/container/latest/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-www.${aws_s3_bucket.bucket.bucket}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 31536000
    default_ttl            = 31536000
    max_ttl                = 31536000
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
