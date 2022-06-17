provider "aws" {
  version = "~> 3.0"
  region  = "us-west-2"
  profile = "default"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "course-microfrontends-bucket"
  tags   = {
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_acl" "acl" {
  bucket = aws_s3_bucket.bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "allow_read_access" {
  bucket = aws_s3_bucket.bucket.id
  policy = templatefile("s3-policy.json", { bucket = aws_s3_bucket.bucket.bucket })
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

output "secret" {
  value = aws_iam_access_key.user_keys.encrypted_secret
}

resource "aws_s3_bucket_policy" "allow_access_from_another_account" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.allow_s3_access.json
}

data "aws_iam_policy_document" "allow_s3_access" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = [aws_iam_user.user.arn]
    }

    actions = [
      "s3:*"
    ]

    resources = [
      aws_s3_bucket.bucket.arn,
      "${aws_s3_bucket.bucket.arn}/*",
    ]
  }
}

# ---

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
