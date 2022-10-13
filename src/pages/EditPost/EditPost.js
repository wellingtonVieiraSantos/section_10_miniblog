import styles from './EditPost.module.css'

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthValue } from '../../context/AuthContext'
import { useUpdateDocument } from '../../hooks/useUpdateDocument'
import { useFetchDocument } from '../../hooks/useFetchDocument'

const EditPost = () => {
  const {id} = useParams()
  const { document: post } = useFetchDocument('posts', id)

  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState('')

  useEffect(()=>{
    if(post){
      setTitle(post.title)
      setBody(post.body)
      setImage(post.image)
      const textTags = post.tagsArray.join(', ')
      setTags(textTags)
    }
  },[post])

  const { user } = useAuthValue()

  const navigate = useNavigate()

  const { updateDocument, response} = useUpdateDocument('posts')

  const handleSubmit = e =>{
    e.preventDefault()
    setFormError('')

    //validate image URL
    try {
      new URL(image)
    } catch (error) {
      return setFormError('A imgem precisa ser uma URL.')
    }

    //criar o array de tags
    const tagsArray = tags.split(',').map(tags => tags.trim().toLowerCase())

    //checar todos os valores
    if(!title || !image || !body || !tags){
      return setFormError('Por favor, preencha todo os campos!')
    }


    if (formError) return;

    const data = {
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    }

    updateDocument(id, data)

    //redirect to home page
    navigate('/dashboard')
  }

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h2>Editando post: {post.title}</h2>
      <p>Altere os dados do post como preferir</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título</span>
            <input 
              type="text"
              name='title' 
              placeholder='Escolha um bom título...'
              required
              onChange={e=>setTitle(e.target.value)}
              value={title}
              />
          </label>
          <label>
            <span>Url da Imagem:</span>
            <input 
              type="text"
              name='image' 
              placeholder='Insira uma imagem que representa o seu post'
              required
              onChange={e=>setImage(e.target.value)}
              value={image}
              />
          </label>
          <p className={styles.preview_title}>Preview da imagem:</p>
          <img className={styles.preview_image} src={post.image} alt={post.title} />
          <label>
            <span>Conteúdo:</span>
            <textarea 
              name='body' 
              placeholder='Insira o conteúdo do post'
              required
              onChange={e=>setBody(e.target.value)}
              value={body}
            >
            </textarea>
          </label>
          <label>
            <span>Tags:</span>
            <input 
              type="text"
              name='tags' 
              required
              placeholder='Insira as tags separadas por vírgula'
              onChange={e=>setTags(e.target.value)}
              value={tags}
              />
          </label>
          {!response.loading && <button className='btn'>Editar</button>}
            {response.loading && <button className='btn' disabled>Aguarde...</button>}
            {response.error && <p className='error'>{response.error}</p>}
            {formError && <p className='error'>{formError}</p>}
        </form>
        </>
      )}
    </div>
  )
}

export default EditPost