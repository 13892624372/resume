import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, BorderStyle } from 'docx'
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

    // 教育背景
    if (resumeData.education.length > 0) {
      children.push(this.createSectionTitle('教育背景'))
      resumeData.education.forEach(edu => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.school, bold: true, size: 24 }),
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
          children.push(
            new Paragraph({
              text: edu.description,
              spacing: { after: 200 }
            })
          )
        }
      })
    }

    // 工作经历
    if (resumeData.workExperience.length > 0) {
      children.push(this.createSectionTitle('工作经历'))
      resumeData.workExperience.forEach(work => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: work.company, bold: true, size: 24 }),
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
        
        // 描述分行
        if (work.description) {
          work.description.split('\n').forEach(line => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  text: `• ${line.trim()}`,
                  spacing: { after: 50 }
                })
              )
            }
          })
        }
        children.push(new Paragraph({ spacing: { after: 200 } }))
      })
    }

    // 项目经历
    if (resumeData.projects.length > 0) {
      children.push(this.createSectionTitle('项目经历'))
      resumeData.projects.forEach(project => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: project.name, bold: true, size: 24 }),
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
          children.push(
            new Paragraph({
              text: `技术栈：${project.techStack}`,
              spacing: { after: 100 }
            })
          )
        }
        
        if (project.description) {
          project.description.split('\n').forEach(line => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  text: `• ${line.trim()}`,
                  spacing: { after: 50 }
                })
              )
            }
          })
        }
        children.push(new Paragraph({ spacing: { after: 200 } }))
      })
    }

    // 专业技能
    if (resumeData.skills.length > 0) {
      children.push(this.createSectionTitle('专业技能'))
      children.push(
        new Paragraph({
          text: resumeData.skills.join('、'),
          spacing: { after: 200 }
        })
      )
    }

    // 自我评价
    if (resumeData.selfEvaluation) {
      children.push(this.createSectionTitle('自我评价'))
      children.push(
        new Paragraph({
          text: resumeData.selfEvaluation,
          spacing: { after: 200 }
        })
      )
    }

    return new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children
      }]
    })
  }

  // 创建章节标题
  private static createSectionTitle(title: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 28,
          color: '2C5AA0'
        })
      ],
      spacing: { before: 300, after: 150 },
      border: {
        bottom: {
          color: '2C5AA0',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 8
        }
      }
    })
  }
}
