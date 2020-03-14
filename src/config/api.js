import host from "./host";

// 类目 增删改查
const createCategoryApi = param => fetch(`${host.blogServer}/createCategory`, {
    method: 'POST',
    body: JSON.stringify({...param}),
    mode: 'cors',
});

const deleteCategoryApi = param => fetch(`${host.blogServer}/deleteCategoryById`, {
    method: 'POST',
    body: JSON.stringify({...param}),
    mode: 'cors',
});

const updateCategoryApi = param => fetch(`${host.blogServer}/updateCategoryById`, {
    method: 'POST',
    body: JSON.stringify({...param}),
    mode: 'cors',
});

const queryCategoryApi = param => fetch(`${host.blogServer}/queryCategory`, {
    method: 'GET',
    mode: 'cors',
})
    .then(response => {
        return response.json();
    });

// 文章 增删改查 保存 发布
const createArticleApi = param => fetch(`${host.blogServer}/creatArticle`, {
    method: 'POST',
    body: JSON.stringify({...param}),
    mode: 'cors',
});

const deleteArticleApi = param => fetch(`${host.blogServer}/deleteArticleById`, {
    method: 'POST',
    body: JSON.stringify({...param}),
    mode: 'cors',
});

const updateArticleApi = param => fetch(`${host.blogServer}/updateArticleById`, {
    method: 'POST',
    body: JSON.stringify({...param}),
    mode: 'cors',
});

const queryArticleApi = param => fetch(`${host.blogServer}/queryArticleById?id=${param.id}`, {
    method: 'GET',
    mode: 'cors',
})
    .then(response => {
        return response.json();
    });

export {
    createCategoryApi,
    deleteCategoryApi,
    updateCategoryApi,
    queryCategoryApi,
    createArticleApi,
    deleteArticleApi,
    updateArticleApi,
    queryArticleApi
}