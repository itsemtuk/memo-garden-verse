
import {
  validateImageFile,
  sanitizeHtml,
  sanitizePlainText,
  validateAndSanitizeBoardInput,
  validateAndSanitizeContent,
  boardNameSchema,
  noteContentSchema,
  imageUrlSchema,
} from '../validation';

describe('File Validation', () => {
  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  describe('validateImageFile', () => {
    it('accepts valid image files', () => {
      const validFiles = [
        createMockFile('test.jpg', 'image/jpeg', 1024 * 1024),
        createMockFile('test.png', 'image/png', 2 * 1024 * 1024),
        createMockFile('test.gif', 'image/gif', 500 * 1024),
        createMockFile('test.webp', 'image/webp', 1024 * 1024),
      ];

      validFiles.forEach(file => {
        const result = validateImageFile(file);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('rejects files that are too large', () => {
      const largeFile = createMockFile('large.jpg', 'image/jpeg', 6 * 1024 * 1024);
      const result = validateImageFile(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size cannot exceed 5MB');
    });

    it('rejects invalid file types', () => {
      const invalidFile = createMockFile('test.pdf', 'application/pdf', 1024);
      const result = validateImageFile(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only JPEG, PNG, GIF, and WebP images are allowed');
    });

    it('rejects files with invalid extensions', () => {
      const invalidFile = createMockFile('test.txt', 'image/jpeg', 1024);
      const result = validateImageFile(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid file extension');
    });

    it('rejects files with suspicious filenames', () => {
      const suspiciousFiles = [
        createMockFile('../test.jpg', 'image/jpeg', 1024),
        createMockFile('test/file.jpg', 'image/jpeg', 1024),
        createMockFile('test\\file.jpg', 'image/jpeg', 1024),
      ];

      suspiciousFiles.forEach(file => {
        const result = validateImageFile(file);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid filename detected');
      });
    });

    it('rejects empty files', () => {
      const emptyFile = createMockFile('empty.jpg', 'image/jpeg', 50);
      const result = validateImageFile(emptyFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File appears to be corrupted or empty');
    });
  });
});

describe('Content Sanitization', () => {
  describe('sanitizeHtml', () => {
    it('allows safe HTML tags', () => {
      const input = '<p><strong>Bold</strong> and <em>italic</em> text</p>';
      const result = sanitizeHtml(input);
      
      expect(result).toBe('<p><strong>Bold</strong> and <em>italic</em> text</p>');
    });

    it('removes dangerous HTML', () => {
      const input = '<script>alert("xss")</script><p>Safe content</p>';
      const result = sanitizeHtml(input);
      
      expect(result).toBe('<p>Safe content</p>');
      expect(result).not.toContain('script');
    });

    it('removes dangerous attributes', () => {
      const input = '<p onclick="alert(\'xss\')" style="color: red;">Text</p>';
      const result = sanitizeHtml(input);
      
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('style');
    });

    it('preserves safe links', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizeHtml(input);
      
      expect(result).toBe('<a href="https://example.com">Link</a>');
    });
  });

  describe('sanitizePlainText', () => {
    it('removes all HTML tags', () => {
      const input = '<p><strong>Bold</strong> text</p>';
      const result = sanitizePlainText(input);
      
      expect(result).toBe('Bold text');
    });

    it('removes script tags and content', () => {
      const input = 'Safe text <script>alert("xss")</script> more text';
      const result = sanitizePlainText(input);
      
      expect(result).toBe('Safe text  more text');
    });
  });
});

describe('Schema Validation', () => {
  describe('boardNameSchema', () => {
    it('accepts valid board names', () => {
      const validNames = [
        'My Board',
        'Project-2024',
        'Board_Name!',
        'Simple Board?',
      ];

      validNames.forEach(name => {
        expect(() => boardNameSchema.parse(name)).not.toThrow();
      });
    });

    it('rejects invalid board names', () => {
      const invalidNames = [
        '', // Empty
        'a'.repeat(101), // Too long
        'Board<script>', // Invalid characters
        'Board@Home', // Invalid characters
      ];

      invalidNames.forEach(name => {
        expect(() => boardNameSchema.parse(name)).toThrow();
      });
    });
  });

  describe('noteContentSchema', () => {
    it('accepts valid note content', () => {
      const validContent = 'This is a valid note content.';
      expect(() => noteContentSchema.parse(validContent)).not.toThrow();
    });

    it('rejects empty content', () => {
      expect(() => noteContentSchema.parse('')).toThrow();
    });

    it('rejects content that is too long', () => {
      const longContent = 'a'.repeat(10001);
      expect(() => noteContentSchema.parse(longContent)).toThrow();
    });
  });

  describe('imageUrlSchema', () => {
    it('accepts valid HTTPS URLs', () => {
      const validUrls = [
        'https://example.com/image.jpg',
        'https://cdn.example.com/images/photo.png',
      ];

      validUrls.forEach(url => {
        expect(() => imageUrlSchema.parse(url)).not.toThrow();
      });
    });

    it('rejects HTTP URLs', () => {
      expect(() => imageUrlSchema.parse('http://example.com/image.jpg')).toThrow();
    });

    it('rejects invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com/file.jpg',
        '',
      ];

      invalidUrls.forEach(url => {
        expect(() => imageUrlSchema.parse(url)).toThrow();
      });
    });
  });
});

describe('Integrated Validation Functions', () => {
  describe('validateAndSanitizeBoardInput', () => {
    it('validates and sanitizes board input correctly', () => {
      const result = validateAndSanitizeBoardInput(
        'My <em>Board</em>',
        'A board <script>alert("xss")</script> description'
      );

      expect(result.name).toBe('My Board');
      expect(result.description).toBe('A board  description');
    });

    it('handles missing description', () => {
      const result = validateAndSanitizeBoardInput('My Board');

      expect(result.name).toBe('My Board');
      expect(result.description).toBeUndefined();
    });
  });

  describe('validateAndSanitizeContent', () => {
    it('validates and sanitizes note content', () => {
      const content = '<p>Note with <strong>formatting</strong></p>';
      const result = validateAndSanitizeContent(content, false);

      expect(result).toBe('<p>Note with <strong>formatting</strong></p>');
    });

    it('validates and sanitizes widget content', () => {
      const content = '<div>Widget content</div>';
      const result = validateAndSanitizeContent(content, true);

      expect(result).toBe('Widget content'); // div is not allowed, only content remains
    });
  });
});
