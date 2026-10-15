import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Crown, PlayCircle, CreditCard, Check, ArrowRight, 
  ExternalLink, Calculator, Sparkles, BookOpen, Edit3, Save, X, Link as LinkIcon
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Settings } from '../types';
import { toast } from 'sonner';

interface ChefCoursesProps {
  settings?: Settings;
}

export interface CourseItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  price: string;
  link?: string;
  image: string;
  isTool?: boolean;
}

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'bem-casado',
    badge: 'Novo',
    title: 'O Segredo do Bem Casado que Vende',
    description: 'Bem casados vendem todos os dias — aprenda do zero a fazer e vender com lucro.',
    price: '$ 87',
    image: 'https://i.postimg.cc/L5nL8F45/patitour-2026-09-30T102033-270.png',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'brigadeiro-gourmet',
    badge: 'Mais procurado',
    title: 'Brigadeiro Gourmet',
    description: '20 sabores campeões de venda, o ponto perfeito e o que usar nos EUA.',
    price: '$ 197',
    image: 'https://i.postimg.cc/GmcGS56Y/patitour-2026-09-25T110017-931.png',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'caseirinhos',
    badge: 'Campeão de vendas',
    title: 'Caseirinhos Gourmets',
    description: 'Bolos caseiros e cucas — os campeões de venda do dia a dia nos EUA.',
    price: '$ 297',
    image: 'https://i.postimg.cc/mkLTG7Rx/Whats-App-Image-2026-09-28-at-8-31-07-PM.jpg',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'sem-gluten',
    badge: 'Nicho premium',
    title: 'Receitas sem Glúten',
    description: '25 receitas de bolos caseiros e recheios sem glúten, com textura perfeita.',
    price: '$ 127',
    image: 'https://i.postimg.cc/HLdsxX4k/Whats-App-Image-2026-09-30-at-2-23-20-PM.jpg',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'brownies',
    badge: 'Queridinho dos EUA',
    title: 'Brownies Lucrativos nos EUA',
    description: 'A maneira mais fácil de iniciar na confeitaria, com pouco investimento.',
    price: '$ 24',
    image: 'https://i.postimg.cc/MZBzhKSx/Whats-App-Image-2026-09-30-at-10-38-02-AM.jpg',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'pudins',
    badge: 'Alto lucro',
    title: 'Pudins Gourmet',
    description: '13 sabores de pudim e estratégias para vender e conquistar clientes.',
    price: '$ 129',
    image: 'https://i.postimg.cc/xj6PVY3S/patitour-2026-09-30T104150-803.png',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'bolos-no-pote',
    badge: 'Venda em escala',
    title: 'Bolos no Pote & Sobremesas',
    description: 'Sobremesas comemorativas e bolos no pote para vender todos os dias.',
    price: '$ 197',
    image: 'https://i.postimg.cc/tRZKYrSL/Whats-App-Image-2026-09-29-at-9-47-13-PM.jpg',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'cupcakes',
    badge: 'Comece hoje',
    title: 'Cupcake & Bolo de Fatia',
    description: 'Aula prática de cupcakes e bolos de fatia para vender hoje mesmo nos EUA.',
    price: '$ 49',
    image: 'https://i.postimg.cc/mr1fTrK9/Whats-App-Image-2026-09-30-at-2-19-02-PM.jpg',
    link: 'https://andreiacakesusa.com/cursos'
  },
  {
    id: 'planilha-precificacao',
    badge: 'FERRAMENTA',
    isTool: true,
    title: 'Planilha de Precificação',
    description: 'Calcule o preço justo de cada doce e garanta seu lucro — pare de cobrar no chute.',
    price: '$ 84',
    image: 'https://i.postimg.cc/XJddGSTK/Whats-App-Image-2026-09-25-at-4-03-11-PM.jpg',
    link: 'https://andreiacakesusa.com/cursos'
  }
];

export default function ChefCourses({ settings }: ChefCoursesProps) {
  const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [mainCourseLink, setMainCourseLink] = useState('https://andreiacakesusa.com/cursos');
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [tempLink, setTempLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load configured links from Firestore
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const snap = await getDoc(doc(db, 'configuracoes', 'chef_courses'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.mainCourseLink && data.mainCourseLink.trim() !== '' && data.mainCourseLink.trim() !== 'https://andreiacakesusa.com/') {
            setMainCourseLink(data.mainCourseLink);
          } else {
            setMainCourseLink('https://andreiacakesusa.com/cursos');
          }
          if (data.links && typeof data.links === 'object') {
            setCourses(prev => prev.map(c => {
              const saved = data.links[c.id];
              const link = (saved && saved.trim() !== '' && saved.trim() !== 'https://andreiacakesusa.com/')
                ? saved.trim()
                : 'https://andreiacakesusa.com/cursos';
              return { ...c, link };
            }));
          }
        }
      } catch (err) {
        console.warn('ChefCourses: Erro ao carregar links:', err);
      }
    };

    fetchLinks();
  }, []);

  const handleSaveCourseLink = async () => {
    if (!editingCourse) return;
    setIsSaving(true);
    try {
      const updatedCourses = courses.map(c => 
        c.id === editingCourse.id ? { ...c, link: tempLink.trim() } : c
      );
      setCourses(updatedCourses);

      const linksMap: Record<string, string> = {};
      updatedCourses.forEach(c => {
        if (c.link) linksMap[c.id] = c.link;
      });

      await setDoc(doc(db, 'configuracoes', 'chef_courses'), {
        links: linksMap,
        mainCourseLink: mainCourseLink,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast.success(`Link de "${editingCourse.title}" salvo com sucesso!`);
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar o link.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMainCourseLink = async (newLink: string) => {
    setIsSaving(true);
    try {
      setMainCourseLink(newLink.trim());
      await setDoc(doc(db, 'configuracoes', 'chef_courses'), {
        mainCourseLink: newLink.trim(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast.success('Link do Curso Principal salvo com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar link do curso principal.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCourseClick = (course: CourseItem) => {
    const targetLink = (course.link && course.link.trim() !== '' && course.link.trim() !== 'https://andreiacakesusa.com/') 
      ? course.link.trim() 
      : 'https://andreiacakesusa.com/cursos';
    window.open(targetLink, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-fade-in font-sans">
      
      {/* Top Header Section (Imagem 2) */}
      <div className="text-center py-6 sm:py-8 max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD5944]/10 text-[#BD5944] text-[11px] font-extrabold uppercase tracking-[0.25em]">
          <Sparkles size={12} />
          <span>VÁ ALÉM</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#2C1810] tracking-tight leading-tight">
          Um curso para cada{' '}
          <span className="italic font-serif relative inline-block text-[#BD5944] px-1">
            especialidade
            <svg 
              className="absolute -bottom-1.5 left-0 w-full overflow-visible pointer-events-none" 
              height="8" 
              viewBox="0 0 100 8" 
              fill="none" 
              preserveAspectRatio="none"
            >
              <path 
                d="M1 5.5C25 2 75 2 99 5.5" 
                stroke="#BD5944" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                opacity="0.7"
              />
            </svg>
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-700 font-medium max-w-xl mx-auto leading-relaxed pt-1">
          Aprofunde no que mais vende e monte um cardápio que ninguém na sua região tem.
        </p>
      </div>

      {/* Main Course Showcase (Imagem 3) */}
      <div className="bg-[#FAF4EE] border border-[#E8D8C8] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Photos Side */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[340px]">
              {/* Main Course Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200">
                <img 
                  src="https://i.postimg.cc/YjB0K5vp/Whats-App-Image-2026-09-30-at-9-41-09-AM.jpg" 
                  alt="Os Segredos da Confeitaria nos EUA" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Alunas Badge */}
                <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 border border-white/15">
                  <span className="text-[#BD5944] font-extrabold text-sm">+4.000</span>
                  <span className="text-gray-200">alunas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Side */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#BD5944]/15 text-[#BD5944] text-xs font-extrabold uppercase tracking-wider border border-[#BD5944]/30">
              <Crown size={14} className="text-[#BD5944]" />
              <span>Curso Principal</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#2C1810] tracking-tight leading-snug">
                Os Segredos da Confeitaria nos EUA
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                O treinamento que pega você do absoluto zero e te leva a profissional lucrativa — com tudo adaptado à realidade de quem vive nos Estados Unidos.
              </p>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E8D8C8] text-center shadow-xs">
                <div className="text-2xl font-black text-[#BD5944] font-serif">15</div>
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Módulos</div>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E8D8C8] text-center shadow-xs">
                <div className="text-2xl font-black text-[#BD5944] font-serif">90</div>
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Vídeo Aulas</div>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E8D8C8] text-center shadow-xs">
                <div className="text-2xl font-black text-[#BD5944] font-serif">100%</div>
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Online</div>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E8D8C8] text-center shadow-xs">
                <div className="text-2xl font-black text-[#BD5944] font-serif">1 ano</div>
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">De Acesso</div>
              </div>
            </div>

            {/* Bullets */}
            <div className="space-y-2 pt-1 text-xs text-gray-800 font-medium">
              {[
                "Adaptação completa das receitas aos ingredientes dos EUA",
                "Do iniciante ao profissional: massas, recheios e acabamentos",
                "Como precificar e lucrar de verdade em dólar",
                "Montagem e estruturação do seu negócio de doces",
                "Estratégias para vender todos os dias e fidelizar clientes"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA & Features */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={(mainCourseLink && mainCourseLink.trim() !== '' && mainCourseLink.trim() !== 'https://andreiacakesusa.com/') ? mainCourseLink.trim() : 'https://andreiacakesusa.com/cursos'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  const targetUrl = (mainCourseLink && mainCourseLink.trim() !== '' && mainCourseLink.trim() !== 'https://andreiacakesusa.com/') ? mainCourseLink.trim() : 'https://andreiacakesusa.com/cursos';
                  window.open(targetUrl, '_blank');
                  e.preventDefault();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#BD5944] hover:bg-[#a64a37] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>Quero o curso principal</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={15} className="text-[#BD5944]" />
                  100% online
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard size={15} className="text-gray-500" />
                  24x no PayPal
                </span>
              </div>
            </div>

            {isEditingLinks && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Link do Curso Principal (ex: https://...)"
                  value={mainCourseLink}
                  onChange={(e) => setMainCourseLink(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleSaveMainCourseLink(mainCourseLink)}
                  className="px-3 py-1.5 bg-[#BD5944] text-white text-xs font-bold rounded-xl"
                >
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Other Courses & Tools (Images 4 & 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-[#2C1810]">
            Cursos Especializados & Ferramentas
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            {courses.length} formações disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isTool = course.isTool;

            return (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                  isTool && !course.image
                    ? 'bg-gradient-to-br from-[#2D211E] to-[#1E1513] text-white border-[#44332F] min-h-[300px]' 
                    : 'bg-black text-white border-gray-800 min-h-[300px]'
                }`}
              >
                {/* Background Image for courses and tools */}
                {Boolean(course.image) && (
                  <div className="absolute inset-0">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
                  </div>
                )}

                {/* Top Badge */}
                <div className="relative z-10 p-5 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-white/90 text-gray-900 shadow-sm backdrop-blur-xs">
                    {course.badge}
                  </span>

                  {isTool ? (
                    <div className="w-10 h-10 rounded-2xl bg-[#BD5944] text-white flex items-center justify-center shadow-md">
                      <Calculator size={18} />
                    </div>
                  ) : (
                    isEditingLinks && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCourse(course);
                          setTempLink(course.link || '');
                        }}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all"
                        title="Editar link do curso"
                      >
                        <Edit3 size={12} />
                      </button>
                    )
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 p-5 space-y-2">
                  <h4 
                    className="text-xl font-serif font-black leading-tight transition-colors drop-shadow-md group-hover:text-[#F3C4B8]"
                    style={{
                      color: '#FFFFFF',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.95), 0 1px 3px rgba(0, 0, 0, 0.85)'
                    }}
                  >
                    {course.title}
                  </h4>
                  <p 
                    className="text-xs font-medium leading-relaxed line-clamp-2"
                    style={{
                      color: '#E5E7EB',
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                  >
                    {course.description}
                  </p>

                  {/* Price & Link Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {!isTool && (
                        <span className="flex items-center gap-1 text-gray-300 text-[11px]">
                          <PlayCircle size={12} className="text-[#BD5944]" />
                          100% online
                        </span>
                      )}
                    </div>

                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetLink = (course.link && course.link.trim() !== '' && course.link.trim() !== 'https://andreiacakesusa.com/') ? course.link.trim() : 'https://andreiacakesusa.com/cursos';
                        window.open(targetLink, '_blank');
                      }}
                      className="flex items-center gap-1 font-bold text-xs text-[#E8A598] hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Saiba mais</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal to configure course link */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#BD5944]/10 text-[#BD5944]">
                  <LinkIcon size={18} />
                </div>
                <h3 className="font-serif font-bold text-base text-gray-900">
                  Configurar Link do Curso
                </h3>
              </div>
              <button 
                onClick={() => setEditingCourse(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-700 block">
                {editingCourse.title}
              </span>
              <p className="text-xs text-gray-500">
                Cole o link de vendas/checkout ou página deste curso.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://..."
                value={tempLink}
                onChange={(e) => setTempLink(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BD5944]/40"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveCourseLink}
                className="px-5 py-2 text-xs font-bold bg-[#BD5944] text-white rounded-xl hover:bg-[#a64a37] shadow-sm flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Salvar Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
