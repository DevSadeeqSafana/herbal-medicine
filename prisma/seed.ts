import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding with WebsiteContent programme catalogue...');

  await prisma.teamMember.deleteMany({});

  const teamMembers = [
    {
      name: 'Pharm. Zainab Ujudud Shariff, FPSN',
      title: 'Herbal Medicine Pioneer & Traditional Medicine Leader',
      bio: 'Pharm. Zainab Ujudud Shariff, FPSN is a distinguished pharmacist, author, researcher, international consultant, and pioneer in Traditional, Complementary and Alternative Medicine (TCAM) with over 35 years of exemplary service in Nigeria’s healthcare sector. Throughout her illustrious career, she served in both the State and Federal Ministries of Health, rising through the ranks from hospital pharmacy practice and medical stores management to senior administrative leadership. She retired as the Pioneer Director of Traditional, Complementary and Alternative Medicine (TCAM) at the Federal Ministry of Health, where she played a transformative role in shaping policies and advancing the integration of traditional medicine into Nigeria’s healthcare system. Her professional journey has been enriched by extensive national and international training, earning certifications in Hospital Pharmacy from Japan and specialized studies in Traditional and Alternative Medicine from China and India. From 2008 to 2014, she served as the Pioneer Managing Director/CEO of the Nigeria Medicinal Plants Development Company, where she successfully championed the cultivation and domestication of Artemisia annua in Nigeria to support the local production of raw materials for antimalarial medicines (ACTs). A passionate advocate for medicinal plants and indigenous healthcare knowledge, Pharm. Shariff has dedicated her life to promoting the development, conservation, scientific validation, and utilization of Africa’s rich medicinal plant resources. She has served on numerous ministerial and presidential committees and played key roles in the development of landmark national initiatives, including the Nigerian Herbal Pharmacopoeia, the publication of the Nigerian Essential Medicinal Plants List, the evaluation and validation of herbal medicines, and the formulation of national policies on Traditional Medicine. Recognized internationally for her expertise, she serves as an International Consultant to the West African Health Organization (WAHO) and is a respected resource person on Traditional Medicine to the West African College of Pharmacists. She has presented more than 100 scholarly papers at national and international conferences, contributing significantly to the advancement of traditional medicine, medicinal plants research, and healthcare policy. Her leadership extends beyond government service. She made history as the first female Chairman of the Pharmaceutical Society of Nigeria (PSN), Abuja Chapter (2007–2010) and later served as National Chairman of the Association of Lady Pharmacists (ALPs) from 2013 to 2018, where she spearheaded Project 91, a pioneering initiative promoting the cultivation and sustainable use of medicinal plants across Nigeria. For nearly a decade, she hosted “Nature’s Pharmacy” on the Nigerian Television Authority (NTA), Africa’s largest television network, educating millions of viewers on medicinal plants, natural healthcare, and wellness. She is also an accomplished columnist, using her writing to advocate for evidence-based traditional medicine and public health awareness. An accomplished author, she has published nine books on medicinal plants and is currently working on three additional publications. She is also a producer of herbal and medicinal plant products, with 21 NAFDAC-listed products to her credit. Today, Pharm. Shariff continues to break new ground as the first pharmacist in Nigeria to establish a dedicated Herbal Pharmacy, located at HMEDIX, Asokoro, Abuja. The facility showcases more than 250 medicinal plant species and raw materials, where she actively practices the art and science of Apothecarism, preserving and advancing the rich heritage of herbal medicine through pharmaceutical excellence. A Fellow of the Pharmaceutical Society of Nigeria (FPSN) and recipient of numerous national and international awards, Pharm. Zainab Ujudud Shariff stands as one of Africa’s foremost authorities on medicinal plants, traditional medicine, and natural health innovation. Her life’s work reflects visionary leadership, scientific excellence, and an unwavering commitment to transforming healthcare through the power of nature.',
      imageUrl: null,
      email: 'info@cosmopolitan.edu.ng',
      phone: '+234 806 559 0444',
      department: 'Herbal & Indigenous Medicine',
      linkedin: null,
      twitter: null,
      facebook: null,
      order: 1,
      isActive: true,
    },
  ];

  for (const teamMember of teamMembers) {
    await prisma.teamMember.create({
      data: teamMember,
    });
    console.log(`Created team member: ${teamMember.name}`);
  }

  const programmes = [
    {
      name: '2-Week Advanced Certificate Curriculum in Herbal Medicine for Professionals',
      description: 'A professional certificate curriculum for medical doctors, pharmacists, nurses, public health experts, researchers, naturopaths, and allied health professionals.',
      duration: '2 weeks',
      price: 450000,
      imageUrl: '/images/programmes/2-week-advanced-certificate.jpg',
      curriculum: JSON.stringify([
        'Introduction to herbal medicine systems',
        'Herbal pharmacognosy and botany',
        'Materia medica: local and global herbs',
        'Herbal pharmacology and safety',
        'Evidence-based herbal practice',
        'Evidence-based practice in clinical settings',
        'Herb-drug and herb-food interactions'
      ]),
      isActive: true,
    },
    {
      name: '4-Week Herbal Medicine Certificate Program',
      description: 'A blended certificate programme for herbal practitioners, health workers, and community health educators with online learning and practical sessions.',
      duration: '4 weeks',
      price: 600000,
      imageUrl: '/images/programmes/4-week-certificate.jpg',
      curriculum: JSON.stringify([
        'Introduction to Herbal Medicine and Indigenous Systems',
        'Medicinal Plants, Botany and Basic Herbal Preparations',
        'Herbal Pharmacology, Safety and Legal Aspects',
        'Clinical Application and Community Health Integration',
        'Community Herbal Health Campaigns',
        'Herbal First Aid Kit design'
      ]),
      isActive: true,
    },
    {
      name: '3-Month Professional Certificate in Herbal Medicine',
      description: 'A blended certificate programme designed to build advanced capacity in herbal medicine formulation, diagnostics, herbal pharmacology, and integrative primary health care using Nigerian indigenous knowledge systems.',
      duration: '3 months',
      price: 800000,
      imageUrl: '/images/programmes/3-month-professional-certificate.jpg',
      curriculum: JSON.stringify([
        'Foundations of Herbal Medicine',
        'Nigerian Herbal Heritage and Medicinal Plant Identification',
        'Herbal Formulations and Practical Labs',
        'Herbal Pharmacology, Toxicology and Safety',
        'Clinical approaches and patient assessment',
        'Integrative Care, Business and Community Practice',
        'Nigerian Herbal Product Development and NAFDAC standards'
      ]),
      isActive: true,
    },
    {
      name: '6-Month Professional Course (Level 1)',
      description: 'A six-month professional herbal medicine course building field-ready practical capability, professional ethics, and clinical/public-health integration.',
      duration: '6 months',
      price: 1000000,
      imageUrl: '/images/programmes/6-month-professional-course.jpg',
      curriculum: JSON.stringify([
        'Scientific and cultural foundations of herbal medicine',
        'Herbal materia medica and plant use',
        'Clinical assessment and patient safety',
        'Herb-drug interactions and regulations',
        'Phytotherapy and community practice',
        'Herbal enterprise and public health delivery'
      ]),
      isActive: true,
    },
    {
      name: '9-Month Advanced Professional Course (Level 2)',
      description: 'An advanced professional programme that deepens herbal medicine practice, integrative treatment planning, research, entrepreneurship, and fieldwork leadership.',
      duration: '9 months',
      price: 1500000,
      imageUrl: '/images/programmes/9-month-advanced-professional-course.jpg',
      curriculum: JSON.stringify([
        'Advanced herbal pharmacology',
        'Clinical pharmacotherapy and case review',
        'Evidence-based herbal clinical protocols',
        'Chronic disease care and integrative frameworks',
        'Herbal product development and regulation',
        'Community outreach, entrepreneurship and project delivery'
      ]),
      isActive: true,
    },
    {
      name: 'Herbal Medicine in Nursing',
      description: 'A four-week nursing-focused herbal medicine course for nursing students, nurses in practice, and healthcare professionals interested in complementary medicine.',
      duration: '4 weeks',
      price: 600000,
      imageUrl: '/images/programmes/herbal-medicine-in-nursing.jpg',
      curriculum: JSON.stringify([
        'Introduction to Herbal Medicine in Nigeria',
        'Nigerian medicinal plants and preparation methods',
        'Integration into Nursing Practice',
        'Ethics, Regulation and Evidence-Based Practice',
        'Case studies and nursing assessment',
        'Assessment, reflective essay and final examination'
      ]),
      isActive: true,
    }
  ];

  await prisma.programme.deleteMany({});

  for (const programme of programmes) {
    await prisma.programme.create({
      data: programme,
    });
    console.log(`Created programme: ${programme.name}`);
  }

  console.log('Database seeding completed successfully with WebsiteContent programme catalogue and team profile catalogue.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
