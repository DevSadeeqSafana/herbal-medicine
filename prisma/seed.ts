import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create sample herbal medicine programmes
  const programmes = [
    {
      name: 'Certificate in Herbal Medicine Fundamentals',
      description: 'This comprehensive programme introduces students to the fundamental principles of herbal medicine, including plant identification, preparation methods, and therapeutic applications. Learn the traditional and modern approaches to herbal remedies.',
      duration: '6 months',
      price: 150000,
      imageUrl: '/images/programmes/fundamentals.jpg',
      curriculum: JSON.stringify([
        'Introduction to Herbal Medicine',
        'Medicinal Plant Identification',
        'Herbal Preparation Techniques',
        'Dosage and Safety',
        'Traditional African Herbal Medicine',
        'Common Ailments and Herbal Treatments',
        'Practical Laboratory Sessions',
        'Clinical Case Studies'
      ]),
      isActive: true,
    },
    {
      name: 'Advanced Certificate in Phytotherapy',
      description: 'An advanced programme focusing on the scientific study of medicinal plants and their therapeutic applications. Covers biochemistry, pharmacology, and clinical applications of herbal medicine in modern healthcare.',
      duration: '1 year',
      price: 280000,
      imageUrl: '/images/programmes/phytotherapy.jpg',
      curriculum: JSON.stringify([
        'Phytochemistry and Plant Biochemistry',
        'Herbal Pharmacology',
        'Clinical Phytotherapy',
        'Research Methods in Herbal Medicine',
        'Quality Control and Standardization',
        'Herb-Drug Interactions',
        'Practice Management',
        'Research Project',
        'Clinical Practicum'
      ]),
      isActive: true,
    },
    {
      name: 'Certificate in Traditional African Medicine',
      description: 'Explore the rich heritage of African traditional medicine. This programme covers indigenous healing practices, medicinal plants native to Africa, and the integration of traditional knowledge with modern healthcare.',
      duration: '8 months',
      price: 200000,
      imageUrl: '/images/programmes/traditional.jpg',
      curriculum: JSON.stringify([
        'History of African Traditional Medicine',
        'Indigenous Medicinal Plants of Africa',
        'Traditional Diagnostic Methods',
        'Spiritual Aspects of African Healing',
        'Preparation of Traditional Remedies',
        'Cultural Context of Healing',
        'Integration with Modern Healthcare',
        'Field Studies and Plant Collection'
      ]),
      isActive: true,
    },
    {
      name: 'Professional Diploma in Herbal Medicine Practice',
      description: 'A comprehensive professional programme designed for practitioners. Covers all aspects of herbal medicine practice, from patient consultation to business management. Includes supervised clinical practice.',
      duration: '18 months',
      price: 450000,
      imageUrl: '/images/programmes/professional.jpg',
      curriculum: JSON.stringify([
        'Comprehensive Herbal Materia Medica',
        'Clinical Assessment and Diagnosis',
        'Treatment Planning and Protocols',
        'Advanced Herbal Formulation',
        'Patient Management',
        'Ethics and Professional Practice',
        'Business and Practice Management',
        'Supervised Clinical Practice (200 hours)',
        'Research and Dissertation'
      ]),
      isActive: true,
    },
    {
      name: 'Short Course: Herbal Medicine for Home Use',
      description: 'A practical short course for individuals interested in using herbal remedies for common household ailments. Learn to prepare simple yet effective herbal remedies for your family.',
      duration: '6 weeks',
      price: 45000,
      imageUrl: '/images/programmes/home-use.jpg',
      curriculum: JSON.stringify([
        'Common Household Medicinal Plants',
        'Basic Herbal Preparations (Teas, Tinctures, Salves)',
        'First Aid with Herbs',
        'Herbs for Digestive Health',
        'Herbs for Immune Support',
        'Safety and Contraindications'
      ]),
      isActive: true,
    }
  ];

  for (const programme of programmes) {
    await prisma.programme.create({
      data: programme,
    });
    console.log(`Created programme: ${programme.name}`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
