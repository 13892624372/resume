import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, BorderStyle, Table, TableCell, TableRow, WidthType, ShadingType } from 'docx'
import { saveAs } from 'file-saver'
import type { ResumeData } from '@/stores/resume'

export class WordExportService {
  // 生成 Word 文档
  static async generateResumeWord(resumeData: ResumeData, template: string): Promise<void> {
    const doc = this.createDocument(resumeData, template)
    const blob = await Packer.toBlob(doc)
    const fileName = `${resumeData.basicInfo.name || '简历'}_${resumeData.basicInfo.jobTitle || '求职'}.docx`
    saveAs(blob, fileName)
  }

  // 创建文档内容
  private static createDocument(resumeData: ResumeData, template: string): Document {
    switch (template) {
      case 'creative':
        return this.createCreativeDocument(resumeData)
      case 'minimal':
        return this.createMinimalDocument(resumeData)
      case 'modern':
      default:
        return this.createModernDocument(resumeData)
    }
  }

  // 现代简约模板
  private static createModernDocument(resumeData: ResumeData): Document {
    const children: Paragraph[] = []

    // 头部信息
    children.push(
      new Paragraph({
        text: resumeData.basicInfo.name || '姓名',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    )

    // 联系信息
    const contactParts: string[] = []
    if (resumeData.basicInfo.phone) contactParts.push(`📱 ${resumeData.basicInfo.phone}`)
    if (resumeData.basicInfo.email) contactParts.push(`📧 ${resumeData.basicInfo.email}`)
    if (resumeData.basicInfo.location) contactParts.push(`📍 ${resumeData.basicInfo.location}`)
    if (resumeData.basicInfo.age) contactParts.push(`年龄：${resumeData.basicInfo.age}岁`)
    
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          text: contactParts.join('    '),
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        })
      )
    }

    // 求职意向
    if (resumeData.basicInfo.jobTitle) {
      children.push(
        new Paragraph({
          text: `求职意向：${resumeData.basicInfo.jobTitle}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        })
      )
    }

    // 各个章节
    this.addEducationSection(children, resumeData, 'modern')
    this.addWorkExperienceSection(children, resumeData, 'modern')
    this.addProjectSection(children, resumeData, 'modern')
    this.addSkillsSection(children, resumeData, 'modern')
    this.addSelfEvaluationSection(children, resumeData, 'modern')

    return new Document({
      sections: [{
        properties: {
          page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        children
      }]
    })
  }

  // 创意现代模板 - 左右分栏布局
  private static createCreativeDocument(resumeData: ResumeData): Document {
    const leftColumn: Paragraph[] = []
    const rightColumn: Paragraph[] = []

    // 左侧栏 - 个人信息和技能
    leftColumn.push(
      new Paragraph({
        text: resumeData.basicInfo.name || '姓名',
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 }
      })
    )

    if (resumeData.basicInfo.jobTitle) {
      leftColumn.push(
        new Paragraph({
          text: resumeData.basicInfo.jobTitle,
          italics: true,
          spacing: { after: 300 }
        })
      )
    }

    // 左侧联系信息
    leftColumn.push(this.createSectionTitle('联系方式', 'creative'))
    if (resumeData.basicInfo.phone) {
      leftColumn.push(new Paragraph({ text: `📱 ${resumeData.basicInfo.phone}`, spacing: { after: 100 } }))
    }
    if (resumeData.basicInfo.email) {
      leftColumn.push(new Paragraph({ text: `📧 ${resumeData.basicInfo.email}`, spacing: { after: 100 } }))
    }
    if (resumeData.basicInfo.location) {
      leftColumn.push(new Paragraph({ text: `📍 ${resumeData.basicInfo.location}`, spacing: { after: 100 } }))
    }
    if (resumeData.basicInfo.age) {
      leftColumn.push(new Paragraph({ text: `年龄：${resumeData.basicInfo.age}岁`, spacing: { after: 200 } }))
    }

    // 左侧技能
    if (resumeData.skills.length > 0) {
      leftColumn.push(this.createSectionTitle('专业技能', 'creative'))
      resumeData.skills.forEach(skill => {
        leftColumn.push(new Paragraph({ text: `• ${skill}`, spacing: { after: 50 } }))
      })
      leftColumn.push(new Paragraph({ spacing: { after: 200 } }))
    }

    // 右侧栏 - 教育、工作、项目
    rightColumn.push(this.createSectionTitle('教育背景', 'creative'))
    resumeData.education.forEach(edu => {
      rightColumn.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: true }),
            new TextRun({ text: `    ${edu.startDate}-${edu.endDate}` })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({ text: `${edu.major} | ${edu.degree}`, spacing: { after: 200 } })
      )
    })

    rightColumn.push(this.createSectionTitle('工作经历', 'creative'))
    resumeData.workExperience.forEach(work => {
      rightColumn.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, bold: true }),
            new TextRun({ text: `    ${work.startDate}-${work.endDate}` })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({ text: work.position, italics: true, spacing: { after: 100 } })
      )
      if (work.description) {
        work.description.split('\n').forEach(line => {
          if (line.trim()) {
            rightColumn.push(new Paragraph({ text: `• ${line.trim()}`, spacing: { after: 50 } }))
          }
        })
      }
      rightColumn.push(new Paragraph({ spacing: { after: 200 } }))
    })

    rightColumn.push(this.createSectionTitle('项目经历', 'creative'))
    resumeData.projects.forEach(project => {
      rightColumn.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.name, bold: true }),
            new TextRun({ text: `    ${project.startDate}-${project.endDate}` })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({ text: project.role, italics: true, spacing: { after: 100 } })
      )
      if (project.techStack) {
        rightColumn.push(new Paragraph({ text: `技术栈：${project.techStack}`, spacing: { after: 100 } }))
      }
      if (project.description) {
        project.description.split('\n').forEach(line => {
          if (line.trim()) {
            rightColumn.push(new Paragraph({ text: `• ${line.trim()}`, spacing: { after: 50 } }))
          }
        })
      }
      rightColumn.push(new Paragraph({ spacing: { after: 200 } }))
    })

    if (resumeData.selfEvaluation) {
      rightColumn.push(this.createSectionTitle('自我评价', 'creative'))
      rightColumn.push(new Paragraph({ text: resumeData.selfEvaluation, spacing: { after: 200 } }))
    }

    // 使用表格实现左右分栏
    return new Document({
      sections: [{
        properties: {
          page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        children: [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: '2C5AA0', type: ShadingType.CLEAR },
                    children: leftColumn
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: rightColumn
                  })
                ]
              })
            ]
          })
        ]
      }]
    })
  }

  // 简约清新模板
  private static createMinimalDocument(resumeData: ResumeData): Document {
    const children: Paragraph[] = []

    // 简洁的头部
    children.push(
      new Paragraph({
        text: resumeData.basicInfo.name || '姓名',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 }
      })
    )

    // 一行联系信息
    const contactParts: string[] = []
    if (resumeData.basicInfo.phone) contactParts.push(resumeData.basicInfo.phone)
    if (resumeData.basicInfo.email) contactParts.push(resumeData.basicInfo.email)
    if (resumeData.basicInfo.location) contactParts.push(resumeData.basicInfo.location)
    
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          text: contactParts.join(' | '),
          spacing: { after: 100 }
        })
      )
    }

    if (resumeData.basicInfo.jobTitle) {
      children.push(
        new Paragraph({
          text: resumeData.basicInfo.jobTitle,
          italics: true,
          spacing: { after: 300 }
        })
      )
    }

    // 简洁的章节
    this.addEducationSection(children, resumeData, 'minimal')
    this.addWorkExperienceSection(children, resumeData, 'minimal')
    this.addProjectSection(children, resumeData, 'minimal')
    this.addSkillsSection(children, resumeData, 'minimal')
    this.addSelfEvaluationSection(children, resumeData, 'minimal')

    return new Document({
      sections: [{
        properties: {
          page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        children
      }]
    })
  }

  // 添加教育背景章节
  private static addEducationSection(children: Paragraph[], resumeData: ResumeData, template: string): void {
    if (resumeData.education.length === 0) return

    children.push(this.createSectionTitle('教育背景', template))
    resumeData.education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: true, size: template === 'modern' ? 24 : 22 }),
            new TextRun({ text: `    ${edu.startDate} - ${edu.endDate}`, size: 22 })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `${edu.major} | ${edu.degree}`,
          spacing: { after: 200 }
        })
      )
      if (edu.description?.trim()) {
        children.push(new Paragraph({ text: edu.description, spacing: { after: 200 } }))
      }
    })
  }

  // 添加工作经历章节
  private static addWorkExperienceSection(children: Paragraph[], resumeData: ResumeData, template: string): void {
    if (resumeData.workExperience.length === 0) return

    children.push(this.createSectionTitle('工作经历', template))
    resumeData.workExperience.forEach(work => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: work.company, bold: true, size: template === 'modern' ? 24 : 22 }),
            new TextRun({ text: `    ${work.startDate} - ${work.endDate}`, size: 22 })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: work.position,
          italics: true,
          spacing: { after: 100 }
        })
      )
      
      if (work.description) {
        work.description.split('\n').forEach(line => {
          if (line.trim()) {
            children.push(new Paragraph({ text: `• ${line.trim()}`, spacing: { after: 50 } }))
          }
        })
      }
      children.push(new Paragraph({ spacing: { after: 200 } }))
    })
  }

  // 添加项目经历章节
  private static addProjectSection(children: Paragraph[], resumeData: ResumeData, template: string): void {
    if (resumeData.projects.length === 0) return

    children.push(this.createSectionTitle('项目经历', template))
    resumeData.projects.forEach(project => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.name, bold: true, size: template === 'modern' ? 24 : 22 }),
            new TextRun({ text: `    ${project.startDate} - ${project.endDate}`, size: 22 })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: project.role,
          italics: true,
          spacing: { after: 100 }
        })
      )
      
      if (project.techStack) {
        children.push(new Paragraph({ text: `技术栈：${project.techStack}`, spacing: { after: 100 } }))
      }
      
      if (project.description) {
        project.description.split('\n').forEach(line => {
          if (line.trim()) {
            children.push(new Paragraph({ text: `• ${line.trim()}`, spacing: { after: 50 } }))
          }
        })
      }
      children.push(new Paragraph({ spacing: { after: 200 } }))
    })
  }

  // 添加技能章节
  private static addSkillsSection(children: Paragraph[], resumeData: ResumeData, template: string): void {
    if (resumeData.skills.length === 0) return

    children.push(this.createSectionTitle('专业技能', template))
    if (template === 'minimal') {
      // 简约模板使用列表形式
      resumeData.skills.forEach(skill => {
        children.push(new Paragraph({ text: `• ${skill}`, spacing: { after: 50 } }))
      })
    } else {
      children.push(new Paragraph({ text: resumeData.skills.join('、'), spacing: { after: 200 } }))
    }
    children.push(new Paragraph({ spacing: { after: 200 } }))
  }

  // 添加自我评价章节
  private static addSelfEvaluationSection(children: Paragraph[], resumeData: ResumeData, template: string): void {
    if (!resumeData.selfEvaluation) return

    children.push(this.createSectionTitle('自我评价', template))
    children.push(new Paragraph({ text: resumeData.selfEvaluation, spacing: { after: 200 } }))
  }

  // 创建章节标题 - 根据模板返回不同样式
  private static createSectionTitle(title: string, template: string): Paragraph {
    const baseConfig = {
      modern: {
        color: '2C5AA0',
        size: 28,
        bold: true,
        border: true
      },
      creative: {
        color: '2C5AA0',
        size: 26,
        bold: true,
        border: false
      },
      minimal: {
        color: '333333',
        size: 24,
        bold: true,
        border: true
      }
    }

    const config = baseConfig[template as keyof typeof baseConfig] || baseConfig.modern

    return new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: config.bold,
          size: config.size,
          color: config.color
        })
      ],
      spacing: { before: 300, after: 150 },
      border: config.border ? {
        bottom: {
          color: config.color,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 8
        }
      } : undefined
    })
  }
}
